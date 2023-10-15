import axiosClient from "@/libs/axios";

const AUTH_ENDPOINT = {
  login: "/auth/sign-in-admin",
  logout: "/auth/logout"
};

const login = async ({ email, password }) => {
  const { data } = await axiosClient.post(AUTH_ENDPOINT.login, { email, password });
  return data;
};

const logout = async () => {
  await axiosClient.get(AUTH_ENDPOINT.logout, {
    params: {
      all_device: true
    }
  })
}

export const authService = { login, logout };
