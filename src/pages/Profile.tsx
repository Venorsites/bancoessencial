import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  X, 
  LogOut,
  Shield,
  Calendar,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalFavorites: number;
  lastLogin: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile, logout: logoutUser } = useUser();
  
  console.log('Profile component - user:', user);
  console.log('Profile component - isAuthenticated:', user ? 'true' : 'false');
  
  const [profile, setProfile] = useState<UserProfile>({
    id: "user-001",
    name: "João Silva",
    email: "joao.silva@email.com",
    joinDate: "2024-01-01",
    totalFavorites: 12,
    lastLogin: "2024-01-15T10:30:00Z"
  });

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate("/login");
    }
  }, [user, navigate]);

  // Carregar dados do usuário do contexto
  useEffect(() => {
    if (user) {
      console.log('User found, updating profile');
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin
      }));
    }

    // Carregar número de favoritos
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setProfile(prev => ({
          ...prev,
          totalFavorites: favorites.length
        }));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setEditForm({
      name: profile.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: profile.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Validações
    if (!editForm.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (editForm.newPassword && editForm.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulação de atualização (remover quando conectar com backend)
    setTimeout(() => {
      const updatedProfile = {
        ...profile,
        name: editForm.name
      };
      
      setProfile(updatedProfile);
      
      // Atualizar contexto do usuário
      updateProfile({ name: editForm.name });

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    // Usar o contexto para fazer logout
    logoutUser();
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });

    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mostrar loading ou redirecionar se não estiver autenticado
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando para login...</p>
          <p className="text-sm text-muted-foreground mt-2">User: {JSON.stringify(user)}</p>
          <p className="text-sm text-muted-foreground mt-2">LocalStorage user: {localStorage.getItem('user')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/xtPW4mv4/fundo.webp"
          alt="Banner Meu Perfil"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
      {/* Debug Info */}
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Debug:</strong> User está autenticado: {user ? 'Sim' : 'Não'}
        </p>
        <p className="text-sm text-yellow-800">
          <strong>User data:</strong> {JSON.stringify(user)}
        </p>
      </div>

      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-soft">
          <User className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Meu Perfil
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gerencie suas informações pessoais e configurações da conta.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="card-organic rounded-3xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{profile.totalFavorites}</div>
                  <div className="text-sm text-muted-foreground">Favoritos</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(profile.joinDate)}
                  </div>
                  <div className="text-sm text-muted-foreground">Membro desde</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    {formatDateTime(profile.lastLogin)}
                  </div>
                  <div className="text-sm text-muted-foreground">Último login</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="card-organic rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-foreground">
                Dados Pessoais
              </CardTitle>
              {!isEditing ? (
                <Button 
                  onClick={handleEdit}
                  variant="outline" 
                  size="sm"
                  className="rounded-xl"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancel}
                    variant="outline" 
                    size="sm"
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    size="sm"
                    className="rounded-xl"
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nome Completo
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-2xl"
                    placeholder="Seu nome completo"
                  />
                ) : (
                  <div className="p-3 rounded-2xl bg-muted/50 text-foreground">
                    {profile.name}
                  </div>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail
                  <Badge variant="secondary" className="text-xs">Não editável</Badge>
                </Label>
                <div className="p-3 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-between">
                  {profile.email}
                  <span className="text-xs text-muted-foreground">
                    Por segurança, o e-mail não pode ser alterado
                  </span>
                </div>
              </div>

              <Separator />

              {/* Password Change Section */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-medium text-foreground">Alterar Senha</h4>
                  
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-foreground font-medium">
                      Senha Atual
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={editForm.currentPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="pl-10 pr-10 rounded-2xl"
                        placeholder="Digite sua senha atual"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground font-medium">
                      Nova Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={editForm.newPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="pl-10 pr-10 rounded-2xl"
                        placeholder="Digite a nova senha (opcional)"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  {editForm.newPassword && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                        Confirmar Nova Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10 rounded-2xl"
                          placeholder="Confirme a nova senha"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-organic rounded-3xl border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-destructive">
                Ações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
                  <div>
                    <h4 className="font-medium text-foreground">Sair da Conta</h4>
                    <p className="text-sm text-muted-foreground">
                      Encerrar sua sessão atual
                    </p>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="destructive" 
                    size="sm"
                    className="rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
