import { atom, selectorFamily, useRecoilCallback } from "recoil";

/**
 * The name of the selected UI theme.
 */
export const ThemeName = atom({
  key: "ThemeName",
  effects: [
    () => {
      console.log(`ThemeName`);
    },
  ],
});

/**
 * The customized Material UI theme.
 * @see https://next.material-ui.com/customization/default-theme/
 */
export const Theme = selectorFamily({
  key: "Theme",
  dangerouslyAllowMutability: true,
  get() {
    return function () {
      console.log(`Theme`);
    };
  },
});

/**
 * Returns a customized Material UI theme.
 *
 * @param name - The name of the requested theme. Defaults to the
 *               auto-detected or user selected value.
 */
export function useTheme() {
  // const selected = useRecoilValue(ThemeName);
  // return useRecoilValue(Theme(name ?? selected));
}

/**
 * Switches between "light" and "dark" themes.
 */
export function useToggleTheme() {
  return useRecoilCallback(
    () => () => {
      console.log(`useToggleTheme`);
    },
    [],
  );
}

export function ThemeProvider(props: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{props.children}</>;
}
