import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      cream: "#FFF8F2",
      pink: "#E8B4B8",
      lavender: "#CDB4DB",
      brown: "#3A2E2E",
      pinkDark: "#D4949A",
      lavenderDark: "#B89EC7",
    },
  },
  fonts: {
    heading: `'Playfair Display', serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#FFF8F2",
        color: "#3A2E2E",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "600",
        letterSpacing: "0.05em",
      },
      variants: {
        gradient: {
          bgGradient: "linear(to-r, #E8B4B8, #CDB4DB)",
          color: "white",
          _hover: {
            bgGradient: "linear(to-r, #D4949A, #B89EC7)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(232,180,184,0.5)",
          },
          transition: "all 0.3s ease",
        },
        soft: {
          bg: "rgba(255,248,242,0.8)",
          border: "2px solid",
          borderColor: "#E8B4B8",
          color: "#3A2E2E",
          _hover: {
            bg: "#E8B4B8",
            color: "white",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "#CDB4DB",
      },
      variants: {
        filled: {
          field: {
            bg: "rgba(205,180,219,0.1)",
            borderRadius: "xl",
            border: "2px solid transparent",
            _focus: {
              borderColor: "#CDB4DB",
              bg: "white",
            },
            _hover: {
              bg: "rgba(205,180,219,0.15)",
            },
          },
        },
      },
    },
  },
});

export default theme;
