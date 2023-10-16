/* eslint-disable react-hooks/exhaustive-deps */
import { useLoginMutation, useLogoutMutation } from "@/hooks/mutations/auth";
import { useGetMe } from "@/hooks/queries/user";
import { useAuthStore } from "@/store/useAuthStore";
import { createContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { clearTokens, getAccessToken, setTokens } from "@/utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, init, logout } = useAuthStore();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const ref = useRef(false);
  const getMeQuery = useGetMe({ enabled: !!isAuthenticated });

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    // console.log("=====RENDER APP======");

    const loadAccessToken = async () => {
      const accessToken = getAccessToken();
      let user = undefined;
      if (accessToken) {
        user = (await getMeQuery.refetch()).data;
      }
      init({ isLoading: false, isAuthenticated: !!accessToken, user });
    };
    loadAccessToken();
  }, []);

  const signIn = async (email, password) => {
    const { accessToken, refreshToken } = await loginMutation.mutateAsync({ email, password });
    setTokens({ accessToken, refreshToken });
    const { data: user } = await getMeQuery.refetch({ throwOnError: true });
    init({ isLoading: false, isAuthenticated: true, user });
  };

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      clearTokens();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
