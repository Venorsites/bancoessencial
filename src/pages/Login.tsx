import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-banco-branca.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      console.log("🔴 Erro capturado no login:", error);
      
      // Extrair a mensagem de erro de diferentes formatos possíveis
      let errorMessage = '';
      
      // Tentar diferentes formas de extrair a mensagem
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error?.response?.data === 'string') {
        errorMessage = error.response.data;
      } else if (error?.response?.data && typeof error.response.data === 'object') {
        // Tentar pegar a propriedade message ou a primeira propriedade string
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      Object.values(error.response.data)[0] as string || '';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.log("📝 Mensagem extraída:", errorMessage);
      
      // Normalizar a mensagem para comparação (case insensitive e remover espaços)
      const normalizedMessage = errorMessage.toUpperCase().trim();
      
      console.log("🔍 Mensagem normalizada:", normalizedMessage);
      
      // Verificar qual tipo de erro é
      if (normalizedMessage === 'USER_NOT_FOUND' || normalizedMessage.includes('USER_NOT_FOUND')) {
        console.log("✅ Mostrando notificação: Usuário não encontrado");
        toast({
          title: 'Usuário não encontrado',
          description: 'O e-mail informado não está cadastrado no sistema.',
          variant: 'destructive',
        });
      } else if (normalizedMessage === 'INVALID_PASSWORD' || normalizedMessage.includes('INVALID_PASSWORD')) {
        console.log("✅ Mostrando notificação: Senha incorreta");
        toast({
          title: 'Senha incorreta',
          description: 'A senha informada está incorreta. Verifique e tente novamente.',
          variant: 'destructive',
        });
      } else if (normalizedMessage === 'ACCOUNT_SUSPENDED' || normalizedMessage.includes('ACCOUNT_SUSPENDED') || normalizedMessage.includes('SUSPENSA') || normalizedMessage.includes('SUSPENSO')) {
        console.log("✅ Mostrando notificação: Conta suspensa");
        toast({
          title: 'Conta suspensa',
          description: 'Sua conta foi suspensa por falta de pagamento. Entre em contato com o suporte para regularizar.',
          variant: 'destructive',
        });
      } else {
        console.log("⚠️ Erro não reconhecido, mostrando mensagem genérica");
        // Erro genérico caso não seja nenhum dos casos acima
        toast({
          title: 'Erro ao fazer login',
          description: errorMessage || 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading se já estiver autenticado
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Redirecionando para a página principal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex justify-center px-4 py-10 md:py-16">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-background.jpg"
          alt="Background aromaterapia"
          className="w-full h-full object-cover"
        />
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
          <div className="flex items-center justify-center mx-auto mb-5">
            <img
              src={logo}
              alt="Logo Banco de Dados Essencial"
              className="h-24 w-auto md:h-32 object-contain"
            />
          </div>

          <p className="text-white/90">
            Faça login para acessar a plataforma
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-organic rounded-3xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold text-foreground">
                Entrar na sua conta
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
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

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 rounded-2xl border-border/50 focus:border-primary/50 transition-colors"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link to="/forgot-password">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-primary text-sm"
                    >
                      Esqueceu a senha?
                    </Button>
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-white/80">
            Ainda não tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-white hover:text-purple-200"
            >
              Entre em contato
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
