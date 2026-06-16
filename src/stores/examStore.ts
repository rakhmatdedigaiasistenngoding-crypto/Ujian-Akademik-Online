import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { ExamSession, Question, ExamConfig } from '../types/exam';
import { ScoreResult } from '../lib/grading';
import { supabase } from '../lib/supabase';

// Use localforage for IndexedDB offline persistence (fallback)
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

interface ExamState {
  session: ExamSession | null;
  config: ExamConfig | null;
  timeRemaining: number; // in seconds
  currentQuestionIndex: number;
  scoreResult: ScoreResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startExam: (config: ExamConfig, studentId: string, deviceId: string) => Promise<void>;
  setAnswer: (questionIndex: number, answerKey: string | null) => Promise<void>;
  setCurrentQuestion: (index: number) => void;
  tickTime: () => void;
  submitExam: () => Promise<void>;
  resetExam: () => void;
  setError: (error: string | null) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      session: null,
      config: null,
      timeRemaining: 0,
      currentQuestionIndex: 0,
      scoreResult: null,
      isLoading: false,
      error: null,

      startExam: async (config, studentId, deviceId) => {
        set({ isLoading: true, error: null });
        
        try {
          // 1. Assign Exam Package & Get Session (Menangani sesi baru & existing otomatis)
          const { data: assignmentData, error: assignError } = await supabase.rpc('assign_exam_package', {
            p_exam_id: config.id,
            p_student_id: studentId,
            p_device_id: deviceId
          });

          if (assignError) throw assignError;
          if (!assignmentData || assignmentData.length === 0) throw new Error("Gagal mendapatkan paket ujian");
          
          const { session_id, package_id, is_new_session } = assignmentData[0];

          console.log("TRACE 1: assignmentData =", assignmentData[0]);

          // 2. Fetch full session data
          const { data: sessionData, error: sessionError } = await supabase
            .from('exam_sessions')
            .select('*')
            .eq('id', session_id)
            .single();

          if (sessionError) throw sessionError;

          // 3. Get Questions for this package
          const { data: qData, error: qError } = await supabase.rpc('get_package_questions', {
            p_package_id: package_id,
            p_student_id: studentId,
          });

          if (qError) throw qError;
          console.log("TRACE 2: qData loaded from package");

          const questions = qData.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: q.options.map((optText: string, idx: number) => ({
              key: idx.toString(),
              text: optText,
            })),
            level: q.level as DifficultyLevel,
            weight: q.weight,
            topic: q.topic,
            image_url: q.image_url,
            video_url: q.video_url,
            link_url: q.link_url,
          }));

          let questionMapping = sessionData.question_mapping;

          // 4. Jika sesi baru, simpan mapping dan buat lembar jawaban kosong
          if (is_new_session || !questionMapping) {
            questionMapping = qData.reduce((acc: any, q: any) => {
              acc[q.id] = q.option_mapping;
              return acc;
            }, {});

            await supabase
              .from('exam_sessions')
              .update({ question_mapping: questionMapping })
              .eq('id', session_id);

            sessionData.question_mapping = questionMapping;

            const answerRecords = questions.map((q) => ({
              session_id: session_id,
              question_id: q.id,
              answer: null,
              is_correct: null,
            }));

            const { error: answersError } = await supabase
              .from('exam_answers')
              .insert(answerRecords);

            if (answersError) throw answersError;
            console.log("TRACE 3: new session mapped and answers created");
          }

          // Load answers if they exist (for resuming)
          const { data: existingAnswers } = await supabase
            .from('exam_answers')
            .select('*')
            .eq('session_id', sessionData.id);
          console.log("TRACE 4: existingAnswers loaded");

          const answersList = new Array(questions.length).fill(null);
          if (existingAnswers) {
            questions.forEach((q, i) => {
              const ans = existingAnswers.find(a => a.question_id === q.id);
              if (ans && ans.answer !== null) {
                answersList[i] = ans.answer.toString();
              }
            });
          }

          // Calculate remaining time
          const startedAt = new Date(sessionData.started_at);
          const now = new Date();
          const elapsedSecs = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
          const totalSecs = config.duration * 60;
          let timeRemaining = totalSecs - elapsedSecs;
          if (timeRemaining < 0) timeRemaining = 0;

          // Create local session object
          const newSession: ExamSession = {
            id: sessionData.id,
            studentId,
            examId: config.id,
            questions,
            answers: answersList,
            startedAt: sessionData.started_at,
            finishedAt: null,
            deviceId,
            score: null,
            status: 'active',
          };

          set({
            session: newSession,
            config,
            timeRemaining: config.duration * 60, // Convert minutes to seconds
            currentQuestionIndex: 0,
            scoreResult: null,
            isLoading: false,
          });
          console.log("TRACE 5: state updated successfully");
        } catch (error) {
          console.error('Error starting exam:', error);
          alert("Gagal di TRACE. Error: " + (error as any)?.message);
          set({
            error: (error as any)?.message || error instanceof Error ? error.message : 'Failed to start exam',
            isLoading: false,
          });
        }
      },

      setAnswer: async (questionIndex, answerKey) => {
        const state = get();
        if (!state.session || state.session.status !== 'active') return;

        // Update local state immediately for fast UI
        const newAnswers = [...state.session.answers];
        newAnswers[questionIndex] = answerKey;
        
        set({
          session: {
            ...state.session,
            answers: newAnswers,
          }
        });

        // Sync to Supabase in background
        try {
          const question = state.session.questions[questionIndex];
          
          // Convert answer key to index (if using letter keys)
          // For now, assuming answerKey is already an index or null
          const answerIndex = answerKey ? parseInt(answerKey) : null;

          await supabase
            .from('exam_answers')
            .update({ answer: answerIndex })
            .eq('session_id', state.session.id)
            .eq('question_id', question.id);
        } catch (error) {
          console.error('Error saving answer:', error);
          // Don't block UI on sync errors
        }
      },

      setCurrentQuestion: (index) => {
        set((state) => {
          if (!state.session) return state;
          // Ensure index is within bounds
          const safeIndex = Math.max(0, Math.min(index, state.session.questions.length - 1));
          return { currentQuestionIndex: safeIndex };
        });
      },

      tickTime: () => {
        set((state) => {
          if (!state.session || state.session.status !== 'active' || state.timeRemaining <= 0) return state;
          
          const newTime = state.timeRemaining - 1;
          
          // Auto-submit when time is up
          if (newTime <= 0) {
            get().submitExam();
          }
          
          return { timeRemaining: newTime };
        });
      },

      submitExam: async () => {
        const state = get();
        if (!state.session || state.session.status === 'submitted') return;

        set({ isLoading: true, error: null });

        try {
          // Call Edge Function to grade the exam
          const { data, error } = await supabase.functions.invoke('grade-exam', {
            body: { sessionId: state.session.id },
          });

          if (error) {
             // Fallback: Jika Edge Function gagal/belum deploy, paksa tutup sesi agar user tidak stuck
             console.warn("Edge function failed, forcing session close fallback");
             await supabase.from('exam_sessions').update({ status: 'submitted' }).eq('id', state.session.id);
             throw error;
          }

          // Update local state with grading results
          const scoreResult: ScoreResult = {
            finalScore: data.score,
            maxRawScore: state.session.questions.reduce((sum, q) => sum + q.weight, 0),
            breakdown: data.breakdown,
          };

          set({
            session: {
              ...state.session,
              status: 'submitted',
              finishedAt: new Date().toISOString(),
              score: data.score,
            },
            scoreResult,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error submitting exam:', error);
          alert("Gagal memproses nilai ujian (mungkin Edge Function belum di-deploy). Namun ujian Anda telah ditutup. Silakan refresh halaman.");
          set({
            error: error instanceof Error ? error.message : 'Failed to submit exam',
            isLoading: false,
            // Fallback status locally so UI escapes
            session: {
               ...state.session,
               status: 'submitted'
            }
          });
        }
      },

      resetExam: () => {
        set({
          session: null,
          config: null,
          timeRemaining: 0,
          currentQuestionIndex: 0,
          scoreResult: null,
          isLoading: false,
          error: null,
        });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'exam-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        session: state.session,
        config: state.config,
        timeRemaining: state.timeRemaining,
        currentQuestionIndex: state.currentQuestionIndex,
        scoreResult: state.scoreResult,
        // isLoading dan error TIDAK disimpan!
      }),
    }
  )
);
