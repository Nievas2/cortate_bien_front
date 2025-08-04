import { useDarkModeContext } from "../contexts/DarkModeContext";

export const useDarkMode = () => {
  const { darkMode, setDarkMode, toggleDarkMode } = useDarkModeContext();
  return { darkMode, setDarkMode, toggleDarkMode };
};
