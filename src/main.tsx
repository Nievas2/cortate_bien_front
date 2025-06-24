import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { AuthContextProvider } from "./contexts/authContext.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SocketProvider } from "./contexts/socketContext.tsx"

const queryClient = new QueryClient()
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
