import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import Index from "./pages/Index";
import Oleos from "./pages/Oleos";
import OilDetail from "./pages/OilDetail";
import Doencas from "./pages/Doencas";
import DoencasGeral from "./pages/DoencasGeral";
import DoencasPediatrica from "./pages/DoencasPediatrica";
import DoencasGestacao from "./pages/DoencasGestacao";
import DoencasMenopausa from "./pages/DoencasMenopausa";
import Quimica from "./pages/Quimica";
import Conteudos from "./pages/Conteudos";
import Receitas from "./pages/Receitas";
import Favoritos from "./pages/Favoritos";
import Profile from "./pages/Profile";
import Notificacoes from "./pages/Notificacoes";
import PoliticaTermos from "./pages/PoliticaTermos";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminOilForm from "./pages/AdminOilForm";
import LandingPage from "./pages/LandingPage";

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
              <Route path="/vendas" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/politica-termos" element={<PoliticaTermos />} />
              
              {/* Rotas administrativas (sem menu) */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              
              {/* Rotas autenticadas (com menu) */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/oleos" element={<Oleos />} />
                      <Route path="/oleos/:id" element={<OilDetail />} />
                      
                      {/* Rotas restritas apenas para ADMIN */}
                      <Route path="/doencas" element={
                        <AdminRoute>
                          <Doencas />
                        </AdminRoute>
                      } />
                      <Route path="/doencas/geral" element={
                        <AdminRoute>
                          <DoencasGeral />
                        </AdminRoute>
                      } />
                      <Route path="/doencas/pediatrica" element={
                        <AdminRoute>
                          <DoencasPediatrica />
                        </AdminRoute>
                      } />
                      <Route path="/doencas/gestacao" element={
                        <AdminRoute>
                          <DoencasGestacao />
                        </AdminRoute>
                      } />
                      <Route path="/doencas/menopausa" element={
                        <AdminRoute>
                          <DoencasMenopausa />
                        </AdminRoute>
                      } />
                      <Route path="/quimica" element={
                        <AdminRoute>
                          <Quimica />
                        </AdminRoute>
                      } />
                      <Route path="/conteudos" element={
                        <AdminRoute>
                          <Conteudos />
                        </AdminRoute>
                      } />
                      <Route path="/receitas" element={
                        <AdminRoute>
                          <Receitas />
                        </AdminRoute>
                      } />
                      
                      <Route path="/favoritos" element={<Favoritos />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/notificacoes" element={<Notificacoes />} />
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
