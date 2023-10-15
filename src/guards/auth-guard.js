/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router
        .replace({
          pathname: "/auth/login",
          query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router.isReady, isLoading]);

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
