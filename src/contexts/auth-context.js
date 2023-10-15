/* eslint-disable react-hooks/exhaustive-deps */
import { useLoginMutation, useLogoutMutation } from "@/hooks/mutations/auth";
import { useGetMe } from "@/hooks/queries/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { createContext, useEffect } from "react";
import PropTypes from "prop-types";
import { clearTokens, getAccessToken, setTokens } from "@/utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, init, login, logout, setUser } = useAuthStore();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  useGetMe({
    enabled: isAuthenticated,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  useEffect(() => {
    const loadAccessToken = async () => {
      const accessToken = getAccessToken();
      init({ isLoading: false, isAuthenticated: !!accessToken });
    };
    loadAccessToken();
  }, []);

  const signIn = async (email, password) => {
    const { accessToken, refreshToken } = await loginMutation.mutateAsync({ email, password });
    setTokens({ accessToken, refreshToken });
    login();
  };

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      clearTokens();
      router.replace({ pathname: "/auth/login" }).catch(console.error);
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
