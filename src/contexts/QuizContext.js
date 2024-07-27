import { createContext, useContext, useReducer, useEffect } from "react";

const SECS_PER_QUESTION = 15;

const QuizContext = createContext();

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: Number(localStorage.getItem("highscore")) || 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, status: "ready", questions: action.payload };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      const addedPoints =
        action.payload === question.correctOption ? question.points : 0;

      return {
        ...state,
        answer: action.payload,
        points: state.points + addedPoints,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.points, state.highscore),
        answer: null,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        highscore: state.highscore,
      };
    case "tick":
      if (state.secondsRemaining < 1) {
        return {
          ...state,
          status: "finished",
          highscore: Math.max(state.points, state.highscore),
          answer: null,
        };
      }

      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
      };
    default:
      throw new Error("Unhandled action type: " + action.type);
  }
}

function QuizProvider({ children }) {
  const [
    { status, questions, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0
  );

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    status === "finished" && localStorage.setItem("highscore", highscore);
  }, [highscore, status]);

  return (
    <QuizContext.Provider
      value={{
        status,
        questions,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPoints,
        dispatchQuiz: dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }

  return context;
}

export { QuizProvider, useQuiz };
