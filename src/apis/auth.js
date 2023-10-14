import axiosClient from "@/libs/axios";

const AUTH_ENDPOINT = {
  login: "/auth/sign-in-admin",
};

const login = async ({ email, password }) => {
  const { data } = await axiosClient.post(AUTH_ENDPOINT.login, { email, password });
  return data;
};

export const authService = { login };
