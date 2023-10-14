import axiosClient from "@/libs/axios";

const USER_ENDPOINT = {
  me: "/users/me",
};

const me = async () => {
  const { data } = await axiosClient.get(USER_ENDPOINT.me);
  return data;
};

export const userService = { me };
