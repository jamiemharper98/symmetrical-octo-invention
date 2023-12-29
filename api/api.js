import axios from "axios";

const bugFreeLamp = axios.create({
  baseURL: "https://bug-free-lamp.onrender.com/api",
});

export const postUser = async (userInfo) => {
  const {
    data: { user },
  } = await bugFreeLamp.post("/users", userInfo);
  console.log(user);
  return user;
};
