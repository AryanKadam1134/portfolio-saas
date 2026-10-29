export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          bg: {
            primary: "#ffffff",
            secondary: "#f4f4f5",
            tertiary: "#e4e4e7",
            hover: "#e4e4e7",
          },
          text: {
            primary: "#09090b",
            secondary: "#18181b",
            tertiary: "#18181b",
          },
          border: {
            primary: "#e4e4e7",
            secondary: "#e4e4e7",
          },
          input: {
            bg: "#ffffff",
            bgFocus: "#f4f4f5",
            bgDisabled: "#e4e4e7",
            border: "#e4e4e7",
            borderFocus: "transparent",
            ring: "#3b82f6",
            text: "#09090b",
            placeholder: "#09090b",
            error: "#ef4444",
          },
        },
        dark: {
          bg: {
            primary: "#09090b",
            secondary: "#18181b",
            tertiary: "#27272a",
            hover: "#27272a",
          },
          text: {
            primary: "#ffffff",
            secondary: "#f4f4f5",
            tertiary: "#f4f4f5",
          },
          border: {
            primary: "#27272a",
            secondary: "#27272a",
          },
          input: {
            bg: "#09090b",
            bgFocus: "#18181b",
            bgDisabled: "#27272a",
            border: "#27272a",
            borderFocus: "transparent",
            ring: "#60a5fa",
            text: "#ffffff",
            placeholder: "#ffffff",
            error: "#f87171",
          },
        },
      },
    },
  },
};
