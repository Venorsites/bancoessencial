import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Heart, Star } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-soft">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Área de Membros
          </h1>
          <p className="text-muted-foreground">
            Acesso exclusivo via Hotmart
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-organic rounded-3xl">
            <CardHeader className="text-center pb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Em Breve: Login Integrado
              </h2>
              <p className="text-muted-foreground text-sm">
                Integração com a plataforma Hotmart em desenvolvimento
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Coming Soon Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Acesso Premium</h3>
                    <p className="text-sm text-muted-foreground">Conteúdos exclusivos e avançados</p>
                  </div>
                  <Badge variant="secondary" className="rounded-xl">Em breve</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Favoritos Sincronizados</h3>
                    <p className="text-sm text-muted-foreground">Seus favoritos em todos os dispositivos</p>
                  </div>
                  <Badge variant="secondary" className="rounded-xl">Em breve</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Certificados</h3>
                    <p className="text-sm text-muted-foreground">Certificados de conclusão de cursos</p>
                  </div>
                  <Badge variant="secondary" className="rounded-xl">Em breve</Badge>
                </div>
              </div>

              {/* Current Access Info */}
              <div className="p-4 rounded-2xl gradient-card border border-border/50">
                <h3 className="font-semibold text-foreground mb-2">
                  🌿 Acesso Gratuito Atual
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Explore nossa base de conhecimento completa sobre óleos essenciais, 
                  doenças e grupos químicos sem necessidade de login.
                </p>
                <Button variant="outline" className="w-full rounded-2xl">
                  Continuar Explorando
                </Button>
              </div>

              {/* Future Integration */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">
                  A integração com Hotmart permitirá acesso a conteúdos premium 
                  e recursos avançados de personalização.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>Desenvolvimento em andamento</span>
                </div>
              </div>
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
          <p className="text-sm text-muted-foreground">
            Dúvidas sobre o acesso premium?{" "}
            <Button variant="link" className="p-0 h-auto text-primary">
              Entre em contato
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}