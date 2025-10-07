import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Oleos from "./pages/Oleos";
import Doencas from "./pages/Doencas";
import DoencasGeral from "./pages/DoencasGeral";
import DoencasPediatrica from "./pages/DoencasPediatrica";
import DoencasGestacao from "./pages/DoencasGestacao";
import DoencasMenopausa from "./pages/DoencasMenopausa";
import Quimica from "./pages/Quimica";
import Conteudos from "./pages/Conteudos";
import Favoritos from "./pages/Favoritos";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminOilForm from "./pages/AdminOilForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* Rotas públicas (sem menu) */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Rotas autenticadas (com menu) */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/oleos" element={<Oleos />} />
                      <Route path="/doencas" element={<Doencas />} />
                      <Route path="/doencas/geral" element={<DoencasGeral />} />
                      <Route path="/doencas/pediatrica" element={<DoencasPediatrica />} />
                      <Route path="/doencas/gestacao" element={<DoencasGestacao />} />
                      <Route path="/doencas/menopausa" element={<DoencasMenopausa />} />
                      <Route path="/quimica" element={<Quimica />} />
                      <Route path="/conteudos" element={<Conteudos />} />
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/oils/new" element={<AdminOilForm />} />
                      <Route path="/admin/oils/edit/:id" element={<AdminOilForm />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
