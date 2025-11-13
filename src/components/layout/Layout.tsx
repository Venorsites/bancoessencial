import { Header } from "./Header";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Check if user is on login page
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isLoginPage && <Header />}
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      {!isLoginPage && <Footer />}
    </div>
  );
}
