import { createContext, useReducer, ReactNode } from "react";
import {
  addUsers,
  crateProject,
  getAllProject,
  getProject,
  verifyToken,
} from "./methods";

export interface State {
  user?: { email: string; id: string };
  projects: Array<project>;
  activeProject?: activeProject;
}

type user = {
  email: string;
  id: string;
};

export interface Action {
  payload: object;
}

interface project {
  name: string;
  _id: string;
  users: Array<string>;
}

interface activeProject {
  name?: string;
  _id?: string;
  users?: user[];
}

interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  methods: {
    verifyToken: () => void;
    getAllProject?: () => void;
    getProject: (args_0: { projectId: string }) => void;
    crateProject: (args_0: { name: string }) => void;
    addUsers: (args_0: { users: string[] }) => void;
  };
}

export const context = createContext<ContextType>({
  state: { user: undefined, projects: [], activeProject: {} },
  dispatch: () => {},
  methods: {
    verifyToken: () => {},
    getAllProject: () => {},
    getProject: () => {},
    crateProject: () => {},
    addUsers: () => {},
  },
});

const globalDispatch = (state: State, { payload }: { payload: object }) => {
  return { ...state, ...payload };
};

export function ContextProvider({ children }: { children: ReactNode }) {
  const initialStates = {
    user: undefined,
    projects: [],
    activeProject: {},
  };
  const [state, dispatch] = useReducer(globalDispatch, initialStates);

  const methods = {
    verifyToken: verifyToken.bind({ state, dispatch }),
    getAllProject: getAllProject.bind({ state, dispatch }),
    getProject: getProject.bind({ state, dispatch }),
    crateProject: crateProject.bind({ state, dispatch }),
    addUsers: addUsers.bind({ state, dispatch }),
  };

  return (
    <context.Provider value={{ state, dispatch, methods }}>
      {children}
    </context.Provider>
  );
}
