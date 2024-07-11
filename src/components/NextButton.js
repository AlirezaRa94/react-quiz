function NextButton({ dispatch, answer, isLastQuestion }) {
  return (
    <button
      className='btn btn-ui'
      disabled={answer === null}
      onClick={() =>
        dispatch({ type: isLastQuestion ? 'finish' : 'nextQuestion' })
      }
    >
      {isLastQuestion ? 'Finish' : 'Next'}
    </button>
  );
}

export default NextButton;
