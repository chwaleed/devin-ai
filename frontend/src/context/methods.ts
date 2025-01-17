import axiosInstance from "../auth/axios.cofig";
import { Action, State } from "./context";

type thisType = {
  state: State;

  dispatch: React.Dispatch<Action>;
};

export async function verifyToken(this: thisType) {
  const { dispatch } = this;

  try {
    await axiosInstance
      .get("/api/verify-user")
      .then((res) => dispatch({ payload: { user: res.data.data } }));
  } catch (error) {
    console.log("Error in getting cookies or Token", error);
  }
}

export async function getAllProject(this: thisType) {
  const { dispatch } = this;
  try {
    const res = await axiosInstance.get("/api/get-projects");
    if (res) {
      dispatch({ payload: { projects: res.data.data } });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProject(
  this: thisType,
  { projectId }: { projectId: string }
) {
  const { dispatch } = this;
  try {
    await axiosInstance
      .get(`/api/get-project/${projectId}`)
      .then((res) => dispatch({ payload: { activeProject: res.data.data } }));
  } catch (error) {
    console.log("Error in finding Project", error);
  }
}

export async function crateProject(this: thisType, { name }: { name: string }) {
  const { dispatch, state } = this;
  try {
    await axiosInstance.post("/api/create-project", { name }).then((res) =>
      dispatch({
        payload: {
          projects: [...state.projects, res.data],
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
}
