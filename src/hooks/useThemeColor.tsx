// Adjust path to where your Colors object is
import { colors } from '../theme/colors';
import { useColorScheme } from './useColorScheme';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof colors.light & keyof typeof colors.dark
) {
    // Destructure 'scheme' from your custom hook
    const { scheme } = useColorScheme();

    // Cast to ensure it matches 'light' | 'dark' and handle null/unspecified
    const activeTheme = (scheme ?? 'light') as 'light' | 'dark';

    const colorFromProps = props[activeTheme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return colors[activeTheme][colorName];
    }
}
