import { useLoginMutation, useLogoutMutation } from "@/hooks/mutations/auth";
import { useGetMe } from "@/hooks/queries/user";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isInitiating: true,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const isAuthenticated = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitiating: false,
    };
  },
  [HANDLERS.SIGN_IN]: (state) => {
    return {
      ...state,
      isAuthenticated: true,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    try {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.log(error);
    }
    return {
      ...state,
      isAuthenticated: false,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  useGetMe({ enabled: state.isAuthenticated })

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.localStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.INITIALIZE,
      payload: isAuthenticated,
    });
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (email, password) => {
    const data = await loginMutation.mutateAsync({ email, password });
    const { accessToken, refreshToken } = data;
    try {
      window.localStorage.setItem("authenticated", "true");
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("refreshToken", refreshToken);
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.SIGN_IN,
    });
  };

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
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

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
