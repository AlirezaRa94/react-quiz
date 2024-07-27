import { useQuiz } from "../contexts/QuizContext";

function StartScreen() {
  const { numQuestions, dispatchQuiz: dispatch } = useQuiz();

  return (
    <div className='start'>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your react mastry</h3>
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: "start" })}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
