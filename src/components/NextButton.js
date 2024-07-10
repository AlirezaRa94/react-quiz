function NextButton({ dispatch, answer }) {
  return (
    <button
      className='btn btn-ui'
      disabled={answer === null}
      onClick={() => dispatch({ type: 'nextQuestion' })}
    >
      Next
    </button>
  );
}

export default NextButton;
