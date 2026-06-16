import { User } from '../types/user';
import { ExamConfig, Question } from '../types/exam';

/**
 * Mock users for testing
 */
export const MOCK_STUDENT: User = {
  id: 'student-001',
  name: 'Andi Pratama',
  email: 'andi.pratama@student.university.ac.id',
  role: 'student',
  identifier: '2021110001', // NPM
  avatarUrl: undefined,
};

export const MOCK_LECTURER: User = {
  id: 'lecturer-001',
  name: 'Dr. Budi Santoso',
  email: 'budi.santoso@university.ac.id',
  role: 'lecturer',
  identifier: '198501012010011001', // NIP
  avatarUrl: undefined,
};

/**
 * Mock exam configuration
 */
export const MOCK_EXAM_CONFIG: ExamConfig = {
  id: 'exam-uas-algo-2024',
  title: 'UAS - Algoritma dan Struktur Data',
  duration: 100, // 120 minutes
  totalQuestions: 33,
  distribution: {
    easy: 11,
    medium: 11,
    hard: 11,
  },
  scoreRelease: 'immediate',
};

/**
 * Mock questions for testing
 * NOTE: correctAnswer is NOT included here for security reasons
 * In production, correctAnswer should only exist on the backend
 */
export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-001',
    text: 'Diberikan sebuah array berisi N angka acak. Algoritma pengurutan manakah yang memiliki kompleksitas waktu kasus terburuk O(n log n) dan bersifat stabil?',
    options: [
      { key: 'A', text: 'Quick Sort' },
      { key: 'B', text: 'Merge Sort' },
      { key: 'C', text: 'Bubble Sort' },
      { key: 'D', text: 'Selection Sort' },
    ],
    level: 'medium',
    weight: 3,
    topic: 'Sorting Algorithms',
  },
  {
    id: 'q-002',
    text: 'Struktur data manakah yang paling efisien untuk implementasi antrian (queue)?',
    options: [
      { key: 'A', text: 'Array' },
      { key: 'B', text: 'Linked List' },
      { key: 'C', text: 'Stack' },
      { key: 'D', text: 'Binary Tree' },
    ],
    level: 'easy',
    weight: 2,
    topic: 'Data Structures',
  },
  {
    id: 'q-003',
    text: 'Kompleksitas waktu untuk operasi pencarian pada Binary Search Tree yang seimbang adalah?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n log n)' },
    ],
    level: 'medium',
    weight: 3,
    topic: 'Tree Structures',
  },
  {
    id: 'q-004',
    text: 'Algoritma Dijkstra digunakan untuk menyelesaikan masalah?',
    options: [
      { key: 'A', text: 'Shortest path dengan bobot negatif' },
      { key: 'B', text: 'Shortest path dengan bobot positif' },
      { key: 'C', text: 'Maximum flow' },
      { key: 'D', text: 'Minimum spanning tree' },
    ],
    level: 'hard',
    weight: 4,
    topic: 'Graph Algorithms',
  },
  {
    id: 'q-005',
    text: 'Apa yang dimaksud dengan Dynamic Programming?',
    options: [
      { key: 'A', text: 'Teknik pemrograman yang menggunakan rekursi' },
      { key: 'B', text: 'Teknik optimasi dengan menyimpan hasil subproblem' },
      { key: 'C', text: 'Teknik sorting yang efisien' },
      { key: 'D', text: 'Teknik pencarian pada graph' },
    ],
    level: 'medium',
    weight: 3,
    topic: 'Algorithm Paradigms',
  },
  {
    id: 'q-006',
    text: 'Operasi push dan pop pada stack memiliki kompleksitas waktu?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n²)' },
    ],
    level: 'easy',
    weight: 2,
    topic: 'Data Structures',
  },
  {
    id: 'q-007',
    text: 'Algoritma Breadth-First Search (BFS) menggunakan struktur data?',
    options: [
      { key: 'A', text: 'Stack' },
      { key: 'B', text: 'Queue' },
      { key: 'C', text: 'Priority Queue' },
      { key: 'D', text: 'Hash Table' },
    ],
    level: 'easy',
    weight: 2,
    topic: 'Graph Algorithms',
  },
  {
    id: 'q-008',
    text: 'Worst case time complexity dari Quick Sort adalah?',
    options: [
      { key: 'A', text: 'O(n log n)' },
      { key: 'B', text: 'O(n²)' },
      { key: 'C', text: 'O(log n)' },
      { key: 'D', text: 'O(n)' },
    ],
    level: 'medium',
    weight: 3,
    topic: 'Sorting Algorithms',
  },
  {
    id: 'q-009',
    text: 'Hash collision dapat diselesaikan dengan metode?',
    options: [
      { key: 'A', text: 'Chaining' },
      { key: 'B', text: 'Open Addressing' },
      { key: 'C', text: 'Keduanya benar' },
      { key: 'D', text: 'Tidak ada yang benar' },
    ],
    level: 'hard',
    weight: 4,
    topic: 'Hashing',
  },
  {
    id: 'q-010',
    text: 'Algoritma Greedy selalu menghasilkan solusi optimal?',
    options: [
      { key: 'A', text: 'Ya, selalu' },
      { key: 'B', text: 'Tidak, tergantung masalah' },
      { key: 'C', text: 'Ya, jika dikombinasi dengan backtracking' },
      { key: 'D', text: 'Tidak pernah' },
    ],
    level: 'hard',
    weight: 4,
    topic: 'Algorithm Paradigms',
  },
];

/**
 * Generate additional mock questions to reach the required total
 * This is a helper function for testing with different question counts
 */
export function generateMockQuestions(count: number): Question[] {
  const questions: Question[] = [...MOCK_QUESTIONS];
  
  // If we need more questions, duplicate and modify IDs
  while (questions.length < count) {
    const baseQuestion = MOCK_QUESTIONS[questions.length % MOCK_QUESTIONS.length];
    questions.push({
      ...baseQuestion,
      id: `q-${String(questions.length + 1).padStart(3, '0')}`,
    });
  }
  
  return questions.slice(0, count);
}
