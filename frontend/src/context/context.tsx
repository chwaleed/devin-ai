import { createContext, useReducer, ReactNode } from "react";
import { verifyToken } from "./methods";

export interface State {
  user?: { email: string; id: string };
}

export interface Action {
  payload: object;
}
interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  methods: {
    verifyToken: () => void;
  };
}

export const context = createContext<ContextType>({
  state: { user: undefined },
  dispatch: () => {},
  methods: {
    verifyToken: () => {},
  },
});

const globalDispatch = (state: State, { payload }: { payload: object }) => {
  return { ...state, ...payload };
};

export function ContextProvider({ children }: { children: ReactNode }) {
  const initialStates = {
    user: undefined,
  };
  const [state, dispatch] = useReducer(globalDispatch, initialStates);

  console.log(state);

  const methods = {
    verifyToken: verifyToken.bind({ state, dispatch }),
  };

  return (
    <context.Provider value={{ state, dispatch, methods }}>
      {children}
    </context.Provider>
  );
}
