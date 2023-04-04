import { createContext, useContext, useEffect, useReducer } from 'react';
import { auth } from './firebase';
import { User, Sub, Comment, Vote, Post } from './types';

interface State {
  authenticated: boolean;
  user: User | null;
  users: User[];
  subs: Sub[];
  comments: Comment[];
  votes: Vote[];
  posts: Post[];
}

interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  subs: [],
  votes: [],
  comments: [],
  users: [],
  posts: [],
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case 'LOGOUT':
      return { ...state, authenticated: false, user: null };
    case 'GET_POSTS':
      return {
        ...state,
        posts: payload,
      };
    case 'GET_SUBS':
      return {
        ...state,
        subs: payload,
      };
    case 'GET_VOTES':
      return {
        ...state,
        votes: payload,
      };
    case 'GET_COMMENTS':
      return {
        ...state,
        comments: payload,
      };
    case 'GET_USERS':
      return {
        ...state,
        users: payload,
      };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    subs: [],
    votes: [],
    comments: [],
    users: [],
    posts: [],
  });

  const dispatch = (type: string, payload?: any) => defaultDispatch({ type, payload });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch('LOGIN', user);
      } else {
        dispatch('LOGOUT');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useContextState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
