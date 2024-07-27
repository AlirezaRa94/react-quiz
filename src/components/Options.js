import { useQuiz } from "../contexts/QuizContext";

function Options() {
  const { questions, answer, index, dispatchQuiz: dispatch } = useQuiz();
  const question = questions[index];
  const hasAnswered = answer !== null;

  return (
    <div className='options'>
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            hasAnswered && index === question.correctOption ? "correct" : ""
          } ${
            answer === index && answer !== question.correctOption ? "wrong" : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
