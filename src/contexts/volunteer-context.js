import { createContext, useContext } from "react";

export const VolunteerContext = createContext({});

export const useVolunteerContext = () => useContext(VolunteerContext);
