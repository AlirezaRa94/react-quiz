import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, status: 'ready', questions: action.payload };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      const addedPoints =
        action.payload === question.correctOption ? question.points : 0;

      return {
        ...state,
        answer: action.payload,
        points: state.points + addedPoints,
      };
    default:
      throw new Error('Unhandled action type: ' + action.type);
  }
}

export default function App() {
  const [{ status, questions, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('http://localhost:8000/questions');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (error) {
        dispatch({ type: 'dataFailed' });
      }
    }

    fetchQuestions();
  }, []);
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}
