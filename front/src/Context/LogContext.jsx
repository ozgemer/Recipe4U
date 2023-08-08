import { createContext } from "react";
export const LogContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
