import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminOils } from "@/components/admin/AdminOils";
import { AdminDiseases } from "@/components/admin/AdminDiseases";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminWebhooks } from "@/components/admin/AdminWebhooks";
import { AdminFinanceiro } from "@/components/admin/AdminFinanceiro";
import { AdminOfertasCupons } from "@/components/admin/AdminOfertasCupons";
import { AdminPolicyAcceptances } from "@/components/admin/AdminPolicyAcceptances";
import { AdminFeedbacks } from "@/components/admin/AdminFeedbacks";
import { AdminEmailTemplates } from "@/components/admin/AdminEmailTemplates";
import { AdminAnalyticsSimple } from "@/components/admin/AdminAnalyticsSimple";
import AdminOilForm from "./AdminOilForm";
import AdminDiseaseForm from "./AdminDiseaseForm";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar se é admin
    if (!user || user.role?.toUpperCase() !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Sincronizar activeTab com a URL atual
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/oils')) {
      setActiveTab('oils');
    } else if (path.includes('/diseases')) {
      setActiveTab('diseases');
    } else if (path.includes('/users')) {
      setActiveTab('users');
    } else if (path.includes('/webhooks')) {
      setActiveTab('webhooks');
    } else if (path.includes('/financeiro')) {
      setActiveTab('financeiro');
    } else if (path.includes('/ofertas-cupons')) {
      setActiveTab('ofertas-cupons');
    } else if (path.includes('/policy-acceptances')) {
      setActiveTab('policy-acceptances');
    } else if (path.includes('/feedbacks')) {
      setActiveTab('feedbacks');
    } else if (path.includes('/email-templates')) {
      setActiveTab('email-templates');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  if (!user || user.role?.toUpperCase() !== 'ADMIN') {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "oils":
        return <AdminOils />;
      case "diseases":
        return <AdminDiseases />;
      case "users":
        return <AdminUsers />;
      case "webhooks":
        return <AdminWebhooks />;
      case "financeiro":
        return <AdminFinanceiro />;
      case "ofertas-cupons":
        return <AdminOfertasCupons />;
      case "policy-acceptances":
        return <AdminPolicyAcceptances />;
      case "feedbacks":
        return <AdminFeedbacks />;
      case "email-templates":
        return <AdminEmailTemplates />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/oils" element={<AdminOils />} />
            <Route path="/oils/new" element={<AdminOilForm />} />
            <Route path="/oils/edit/:id" element={<AdminOilForm />} />
            <Route path="/diseases" element={<AdminDiseases />} />
            <Route path="/diseases/new" element={<AdminDiseaseForm />} />
            <Route path="/diseases/edit/:id" element={<AdminDiseaseForm />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/webhooks" element={<AdminWebhooks />} />
            <Route path="/financeiro" element={<AdminFinanceiro />} />
            <Route path="/ofertas-cupons" element={<AdminOfertasCupons />} />
            <Route path="/policy-acceptances" element={<AdminPolicyAcceptances />} />
            <Route path="/feedbacks" element={<AdminFeedbacks />} />
            <Route path="/email-templates" element={<AdminEmailTemplates />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

