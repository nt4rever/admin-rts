import { createContext, useContext } from "react";

export const ReportContext = createContext({});

export const useReportContext = () => useContext(ReportContext);
