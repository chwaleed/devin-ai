import { createContext, useReducer, ReactNode } from "react";

interface State {
  user?: { email: string; id: string };
}

interface Action {
  payload: object;
}
interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const context = createContext<ContextType>({
  state: { user: undefined },
  dispatch: () => {},
});

const globalDispatch = (state: State, { payload }: { payload: object }) => {
  console.log(payload);
  return { ...state, ...payload };
};

const initialStates = {
  user: undefined,
};

export function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalDispatch, initialStates);

  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
}
