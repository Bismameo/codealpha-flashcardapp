"use client";
import { useState } from "react";

const quizzes = [
  {
    id: "general",
    title: "General knowledge",
    description: "A little bit of everything",
    questions: [
      { prompt: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Mercury", "Jupiter"], answer: "Mars" },
      { prompt: "What is the largest mammal on Earth?", options: ["African elephant", "Giraffe", "Blue whale", "Polar bear"], answer: "Blue whale" },
      { prompt: "How many seconds are there in one minute?", options: ["50", "100", "30", "60"], answer: "60" },
      { prompt: "What do you call a shape with seven sides?", options: ["Hexagon", "Heptagon", "Octagon", "Pentagon"], answer: "Heptagon" },
    ],
  },
  {
    id: "science",
    title: "Everyday science",
    description: "Curious facts about our world",
    questions: [
      { prompt: "What is the chemical formula for water?", options: ["CO2", "O2", "H2O", "NaCl"], answer: "H2O" },
      { prompt: "Which gas do plants absorb from the air?", options: ["Oxygen", "Carbon dioxide", "Hydrogen", "Helium"], answer: "Carbon dioxide" },
      { prompt: "What force pulls objects toward Earth?", options: ["Magnetism", "Friction", "Gravity", "Pressure"], answer: "Gravity" },
      { prompt: "Which star is closest to Earth?", options: ["Sirius", "Polaris", "Alpha Centauri", "The Sun"], answer: "The Sun" },
    ],
  },
  {
    id: "geography",
    title: "World geography",
    description: "Take a trip around the globe",
    questions: [
      { prompt: "What is the capital of Japan?", options: ["Kyoto", "Seoul", "Tokyo", "Osaka"], answer: "Tokyo" },
      { prompt: "Which is the largest ocean?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
      { prompt: "On which continent is the Sahara Desert?", options: ["Asia", "Africa", "South America", "Australia"], answer: "Africa" },
      { prompt: "The Andes mountain range is in which continent?", options: ["Europe", "Africa", "South America", "North America"], answer: "South America" },
    ],
  },
  {
    id: "history",
    title: "History highlights",
    description: "Big moments from the past",
    questions: [
      { prompt: "In what year did humans first land on the Moon?", options: ["1959", "1969", "1979", "1989"], answer: "1969" },
      { prompt: "Who is associated with the European printing press?", options: ["Isaac Newton", "Leonardo da Vinci", "Johannes Gutenberg", "Galileo Galilei"], answer: "Johannes Gutenberg" },
      { prompt: "Which ancient civilization built the pyramids at Giza?", options: ["Romans", "Ancient Egyptians", "Mayans", "Greeks"], answer: "Ancient Egyptians" },
      { prompt: "In what year did the Berlin Wall fall?", options: ["1979", "1985", "1989", "1995"], answer: "1989" },
    ],
  },
];

export default function FlashcardApp() {
  const [selectedQuizId, setSelectedQuizId] = useState(quizzes[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(() =>
    Array(quizzes[0].questions.length).fill(null),
  );
  const [isComplete, setIsComplete] = useState(false);

  const quiz = quizzes.find((item) => item.id === selectedQuizId) ?? quizzes[0];
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const score = selectedAnswers.filter((answer, index) => answer === quiz.questions[index].answer).length;
  const hasAnswered = selectedAnswer !== null;

  const handleQuizChange = (quizId) => {
    const nextQuiz = quizzes.find((item) => item.id === quizId) ?? quizzes[0];
    setSelectedQuizId(nextQuiz.id);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(nextQuiz.questions.length).fill(null));
    setIsComplete(false);
  };

  const handleSelectAnswer = (answer) => {
    if (hasAnswered) return;
    setSelectedAnswers((previousAnswers) => previousAnswers.map((value, index) =>
      index === currentQuestionIndex ? answer : value,
    ));
  };

  const handleNextQuestion = () => {
    if (!hasAnswered) return;
    if (currentQuestionIndex === quiz.questions.length - 1) {
      setIsComplete(true);
      return;
    }
    setCurrentQuestionIndex((index) => index + 1);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.questions.length).fill(null));
    setIsComplete(false);
  };

  return (
    <main className="app-shell">
      <section className="study-view" aria-label="Quiz study session">
        <header className="study-header">
          <p className="eyebrow">A MOMENT TO LEARN</p>
          <h1>Quiz <span>studio</span></h1>
          <p className="header-copy">Choose a subject and see what you know.</p>
        </header>

        <div className="quiz-picker">
          <label htmlFor="quiz-select">Choose a quiz</label>
          <select id="quiz-select" value={selectedQuizId} onChange={(event) => handleQuizChange(event.target.value)}>
            {quizzes.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <p>{quiz.description} <span>{quiz.questions.length} questions</span></p>
        </div>

        {isComplete ? (
          <section className="result-panel" aria-live="polite">
            <p className="result-kicker">QUIZ COMPLETE</p>
            <span className="result-score">{score}<span> / {quiz.questions.length}</span></span>
            <h2>{score === quiz.questions.length ? "A perfect round." : score >= quiz.questions.length / 2 ? "Nicely done." : "Good practice."}</h2>
            <p className="result-copy">You answered {score} of {quiz.questions.length} questions correctly.</p>
            <button className="answer-button" onClick={restartQuiz} type="button">Try again <span aria-hidden="true">↻</span></button>
          </section>
        ) : (
          <>
            <div className="quiz-progress">
              <div className="progress-labels">
                <span>QUESTION {String(currentQuestionIndex + 1).padStart(2, "0")} <i>/</i> {String(quiz.questions.length).padStart(2, "0")}</span>
                <span>{score} correct</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-valuenow={currentQuestionIndex + 1}>
                <span style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }} />
              </div>
            </div>

            <article className="flashcard quiz-card" key={`${quiz.id}-${currentQuestionIndex}`}>
              <div className="card-meta"><span>{quiz.title}</span><span>Pick one answer</span></div>
              <div className="card-content">
                <p className="card-prompt">Take your best guess</p>
                <h2 className="card-copy">{currentQuestion.prompt}</h2>
              </div>
              <div className="answer-options" role="group" aria-label="Answer options">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.answer;
                  const stateClass = hasAnswered && isCorrect ? "is-correct" : hasAnswered && isSelected ? "is-incorrect" : "";
                  return (
                    <button
                      className={`answer-option ${stateClass}`}
                      key={option}
                      onClick={() => handleSelectAnswer(option)}
                      type="button"
                      disabled={hasAnswered}
                      aria-pressed={isSelected}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {hasAnswered && isCorrect && <span className="option-mark" aria-label="Correct answer">✓</span>}
                      {hasAnswered && isSelected && !isCorrect && <span className="option-mark" aria-label="Your answer">×</span>}
                    </button>
                  );
                })}
              </div>
              {hasAnswered && (
                <p className={`answer-feedback ${selectedAnswer === currentQuestion.answer ? "is-correct" : "is-incorrect"}`} role="status">
                  {selectedAnswer === currentQuestion.answer ? "That's right. Nicely remembered." : `Not quite. The answer is ${currentQuestion.answer}.`}
                </p>
              )}
              <div className="card-footer"><span>✳</span><span>TAKE YOUR TIME</span></div>
            </article>

            <div className="study-controls">
              <button className="next-button" onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))} type="button" disabled={currentQuestionIndex === 0}>
                <span aria-hidden="true">←</span> Previous
              </button>
              <button className="answer-button" onClick={handleNextQuestion} type="button" disabled={!hasAnswered}>
                {currentQuestionIndex === quiz.questions.length - 1 ? "Finish quiz" : "Next question"}
                <span aria-hidden="true">{currentQuestionIndex === quiz.questions.length - 1 ? "✓" : "→"}</span>
              </button>
            </div>
          </>
        )}
        <p className="study-note">One question at a time. You&apos;ve got this.</p>
      </section>
    </main>
  );
}
