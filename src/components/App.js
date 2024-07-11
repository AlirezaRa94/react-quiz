import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import Options from './Options';
import NextButton from './NextButton';
import Progrss from './Progrss';
import FinishScreen from './FinishScreen';

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
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
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: Math.max(state.points, state.highscore),
        answer: null,
      };
    case 'restart':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions,
        highscore: state.highscore,
      };
    default:
      throw new Error('Unhandled action type: ' + action.type);
  }
}

export default function App() {
  const [{ status, questions, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0
  );

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
          <>
            <Progrss
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question question={questions[index]}>
              <Options
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
            </Question>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              isLastQuestion={index === numQuestions - 1}
            />
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
