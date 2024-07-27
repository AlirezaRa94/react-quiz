import { useQuiz } from "../contexts/QuizContext";

function Progrss() {
  const { index, numQuestions, points, maxPoints, answer } = useQuiz();
  return (
    <header className='progress'>
      <progress
        value={index + Number(answer !== null)}
        max={numQuestions}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default Progrss;
