import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const { dispatchQuiz: dispatch, answer, index, numQuestions } = useQuiz();
  const isLastQuestion = index === numQuestions - 1;

  return (
    <button
      className='btn btn-ui'
      disabled={answer === null}
      onClick={() =>
        dispatch({ type: isLastQuestion ? "finish" : "nextQuestion" })
      }
    >
      {isLastQuestion ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
