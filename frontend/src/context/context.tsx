import { createContext, useReducer, ReactNode } from "react";

export const context = createContext<null | unknown>(null);

const globalDispatch = (state: object, { payload }: { payload: object }) => {
  return { ...state, ...payload };
};

const initialStates = {
  user: "",
};

export function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalDispatch, initialStates);

  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
}
