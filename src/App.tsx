
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DirectMessages from "./pages/DirectMessages";
import ServerView from "./pages/ServerView";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import UserSettings from "./pages/UserSettings";
import NitroPage from "./pages/NitroPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/channels" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/channels/@me" element={<PrivateRoute><DirectMessages /></PrivateRoute>} />
              <Route path="/channels/@me/:userId" element={<PrivateRoute><DirectMessages /></PrivateRoute>} />
              <Route path="/channels/:serverId/:channelId?" element={<PrivateRoute><ServerView /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><UserSettings /></PrivateRoute>} />
              <Route path="/nitro" element={<PrivateRoute><NitroPage /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
