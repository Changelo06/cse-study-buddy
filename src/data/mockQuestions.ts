export type QuestionOption = {
  id: string; // "A", "B", "C", "D", "E"
  text: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
};

// Generates placeholder questions for a given quiz
export function generateMockQuestions(quizId: string, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  for (let i = 1; i <= count; i++) {
    const isMath = quizId.includes("interest") || quizId.includes("math");
    const isVerbal = quizId.includes("verbal");
    
    let text = `Placeholder question ${i} for ${quizId}. Which of the following is the correct answer?`;
    if (isMath) {
      text = `Solve the following problem: What is ${i * 10}% of ${i * 500}?`;
    } else if (isVerbal) {
      text = `Identify the correct synonym for the word "OBFUSCATE" in the context of question ${i}.`;
    }

    const options: QuestionOption[] = [
      { id: "A", text: `Option A for question ${i}` },
      { id: "B", text: `Option B for question ${i}` },
      { id: "C", text: `Option C for question ${i}` },
      { id: "D", text: `Option D for question ${i}` },
      { id: "E", text: `Option E for question ${i}` },
    ];

    // Pick a pseudo-random correct option based on question index
    const correctIndex = (i * 3) % 5;
    const correctOptionId = options[correctIndex].id;

    questions.push({
      id: `q-${quizId}-${i}`,
      text,
      options,
      correctOptionId,
      explanation: `The correct answer is ${correctOptionId} because this is the explanation for question ${i}. In a real scenario, this would explain the concept behind the correct choice.`,
    });
  }
  
  return questions;
}
