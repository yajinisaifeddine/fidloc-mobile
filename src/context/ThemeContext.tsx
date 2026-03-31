import { createContext, useContext } from "react";
import { darkTheme, lightTheme } from "../theme";
import { ColorSchemeName } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

// context/ThemeContext.tsx
const ThemeContext = createContext({
    theme: lightTheme,
    setColorScheme: (_: ColorSchemeName) => { },
    resetToSystem: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { scheme, setColorScheme, resetToSystem } = useColorScheme();
    const theme = scheme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, setColorScheme, resetToSystem }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
