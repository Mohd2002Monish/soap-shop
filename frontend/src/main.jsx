import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index.js";
import theme from "./theme.js";
import App from "./App.jsx";
import "./index.css";

// Initialize guest session on app load
import { getOrCreateGuestId } from "./utils/guestSession.js";
getOrCreateGuestId();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
