import { createContext, useContext } from "react";

export const MangerContext = createContext({});

export const useManagerContext = () => useContext(MangerContext);
