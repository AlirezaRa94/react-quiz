import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
  const seconds = String(secondsRemaining % 60).padStart(2, '0');

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  return <div className='timer'>{`${minutes}:${seconds}`}</div>;
}

export default Timer;