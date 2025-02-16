import axiosInstance from "../../auth/axios.cofig";

export const getAllUsers = async ({ setUsers }) => {
  try {
    axiosInstance
      .get("/api/get-all-user")
      .then((res) => setUsers(res?.data?.data));
  } catch (error) {
    console.log("Error in getting users ", error);
  }
};
