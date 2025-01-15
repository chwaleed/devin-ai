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
