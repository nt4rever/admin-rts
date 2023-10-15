/* eslint-disable react-hooks/exhaustive-deps */
import { ROLES } from "@/constants/role";
import routeConfig from "@/constants/route-config";
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
    if (!router.isReady || isLoading) return;

    // console.log(">>>>>>>CHECK AUTH & ROLE");
    if (!isAuthenticated || !user) {
      // console.log("#####REDIRECT to /auth/login page");
      router
        .replace({
          pathname: "/auth/login",
          query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } else if (!routeConfig[user?.role || "auth"][router.pathname]) {
      // console.log("#####REDIRECT to /403 page");
      router.replace("403");
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router.isReady, router.pathname]);

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
