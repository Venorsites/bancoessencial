import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import logo from "@/assets/logov1.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de envio de email (remover quando conectar com backend real)
    setTimeout(() => {
      if (email) {
        setIsEmailSent(true);
        toast({
          title: "Email enviado com sucesso!",
          description: "Verifique sua caixa de entrada para redefinir a senha.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Por favor, insira um email válido.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsEmailSent(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen relative flex justify-center px-4 py-10 md:py-16">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/hero-background.jpg"
          alt="Background aromaterapia"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/60 to-purple-900/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-4">
            <img 
              src={logo} 
              alt="Logo Banco de Dados Essencial" 
              className="h-24 w-auto md:h-28 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Recuperar Senha
          </h1>
          <p className="text-white/90">
            {isEmailSent 
              ? "Verifique seu email para continuar" 
              : "Digite seu email para redefinir a senha"
            }
          </p>
        </motion.div>

        {/* Back to Login Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Link to="/login">
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-200 hover:bg-white/10"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </Button>
          </Link>
        </motion.div>

        {/* Form or Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!isEmailSent ? (
            <Card className="card-organic rounded-3xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Redefinir Senha
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="pl-10 rounded-2xl border-border/50 focus:border-primary/50 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full rounded-2xl gradient-primary text-white font-medium py-3 hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-organic rounded-3xl">
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Email Enviado!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Enviamos um link de redefinição para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleBackToLogin}
                    variant="outline"
                    className="w-full rounded-2xl"
                  >
                    Enviar Novamente
                  </Button>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="w-full rounded-2xl"
                    >
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-white/80">
            Lembrou sua senha?{" "}
            <Link to="/login">
              <Button variant="link" className="p-0 h-auto text-white hover:text-purple-200">
                Faça login aqui
              </Button>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
