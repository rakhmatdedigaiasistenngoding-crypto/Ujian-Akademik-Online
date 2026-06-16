import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get session_id from request body
    const { sessionId } = await req.json()

    if (!sessionId) {
      throw new Error('session_id is required')
    }

    // 1. Get session details
    const { data: session, error: sessionError } = await supabase
      .from('exam_sessions')
      .select('*, exam_configs(*)')
      .eq('id', sessionId)
      .single()

    if (sessionError) throw sessionError
    if (!session) throw new Error('Session not found')

    // 2. Get all answers for this session with question details
    const { data: answers, error: answersError } = await supabase
      .from('exam_answers')
      .select('*, questions(*)')
      .eq('session_id', sessionId)

    if (answersError) throw answersError

    // 3. Get question mapping from session (for randomization)
    const questionMapping = session.question_mapping || {}

    // 4. Grade each answer
    let totalScore = 0
    let correctCount = 0
    const breakdown = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    }

    const gradedAnswers = answers.map((answer: any) => {
      const question = answer.questions
      const level = question.level
      
      // Get option mapping for this question (if randomized)
      const optionMapping = questionMapping[question.id] || {}
      
      // Convert student's selected index back to original index
      const originalIndex = optionMapping[answer.answer?.toString()] !== undefined
        ? parseInt(optionMapping[answer.answer.toString()])
        : answer.answer

      // Check if answer is correct
      const isCorrect = originalIndex === question.correct_answer
      const score = isCorrect ? question.weight : 0

      // Update totals
      totalScore += score
      if (isCorrect) correctCount++

      // Update breakdown by level
      breakdown[level].total++
      if (isCorrect) breakdown[level].correct++

      return {
        id: answer.id,
        is_correct: isCorrect
      }
    })

    // 5. Update all answers with is_correct
    const { error: updateAnswersError } = await supabase
      .from('exam_answers')
      .upsert(gradedAnswers)

    if (updateAnswersError) throw updateAnswersError

    // 6. Update session with final score and status
    const { error: updateSessionError } = await supabase
      .from('exam_sessions')
      .update({
        score: totalScore,
        status: 'submitted',
        finished_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (updateSessionError) throw updateSessionError

    // 7. Return grading results
    return new Response(
      JSON.stringify({
        success: true,
        sessionId,
        score: totalScore,
        correctCount,
        totalQuestions: answers.length,
        breakdown
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
