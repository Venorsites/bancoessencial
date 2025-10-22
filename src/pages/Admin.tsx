import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminOils } from "@/components/admin/AdminOils";
import { AdminDiseases } from "@/components/admin/AdminDiseases";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminAnalyticsSimple } from "@/components/admin/AdminAnalyticsSimple";
import AdminOilForm from "./AdminOilForm";
import AdminDiseaseForm from "./AdminDiseaseForm";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

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
    if (path.includes('/oils/new') || path.includes('/oils/edit/')) {
      setActiveTab('oils');
    } else if (path.includes('/diseases/new') || path.includes('/diseases/edit/')) {
      setActiveTab('diseases');
    } else if (path.includes('/users')) {
      setActiveTab('users');
    } else if (path.includes('/analytics')) {
      setActiveTab('analytics');
    } else if (path.includes('/settings')) {
      setActiveTab('settings');
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
      case "analytics":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Testando se o componente carrega...</p>
            <AdminAnalyticsSimple />
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h2>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

