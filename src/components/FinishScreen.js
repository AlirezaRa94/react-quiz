function FinishScreen({ points, maxPoints, highscore, dispatch }) {
  const percentage = (points / maxPoints) * 100;
  let emoji;
  if (percentage === 100) {
    emoji = '🥇';
  } else if (percentage >= 75) {
    emoji = '👏';
  } else if (percentage >= 50) {
    emoji = '🙂';
  } else if (percentage >= 25) {
    emoji = '😬';
  } else {
    emoji = '😢';
  }

  return (
    <>
      <p className='result'>
        <span>{emoji}</span>You Scored <strong>{points}</strong> out of{' '}
        {maxPoints} ({Math.round(percentage)}%)
      </p>
      <p className='highscore'>(Highscore: {highscore} points)</p>
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
