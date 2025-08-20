import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Droplets, Heart, BookOpen, Beaker, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const features = [
    {
      icon: Droplets,
      title: "Óleos Essenciais",
      description: "Base completa com propriedades e aplicações de centenas de óleos essenciais",
      href: "/oleos",
      color: "from-blue-400 to-blue-600",
      count: "150+ óleos"
    },
    {
      icon: Heart,
      title: "Guia de Doenças",
      description: "Recomendações de óleos essenciais para diferentes condições de saúde",
      href: "/doencas",
      color: "from-pink-400 to-pink-600",
      count: "A-Z completo"
    },
    {
      icon: Beaker,
      title: "Grupos Químicos",
      description: "Compreenda a química por trás dos óleos essenciais e suas propriedades",
      href: "/quimica",
      color: "from-purple-400 to-purple-600",
      count: "6 grupos principais"
    },
    {
      icon: BookOpen,
      title: "Conteúdos da Dai",
      description: "Acesso organizado aos conteúdos educativos do Instagram",
      href: "/conteudos",
      color: "from-green-400 to-green-600",
      count: "100+ posts"
    }
  ];

  const stats = [
    { number: "300+", label: "Óleos Catalogados" },
    { number: "150+", label: "Condições de Saúde" },
    { number: "50+", label: "Grupos Químicos" },
    { number: "1000+", label: "Usuários Ativos" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-background/80 backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="rounded-full px-6 py-2 mb-6 animate-float">
              <Star className="w-4 h-4 mr-2" />
              Sua referência em aromaterapia
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Banco de Dados de
              <span className="block gradient-primary bg-clip-text text-transparent animate-gentle-pulse">
                Óleos Essenciais
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Descubra o poder dos óleos essenciais com nossa base de conhecimento completa. 
              Encontre propriedades, aplicações terapêuticas e muito mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/oleos">
                <Button size="lg" className="rounded-2xl px-8 py-6 text-lg gradient-primary glow-soft">
                  <Search className="w-5 h-5 mr-2" />
                  Explorar Óleos
                </Button>
              </Link>
              <Link to="/doencas">
                <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg backdrop-blur-sm">
                  <Heart className="w-5 h-5 mr-2" />
                  Guia de Doenças
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Nosso Banco de Dados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acesse informações detalhadas sobre óleos essenciais, suas propriedades e aplicações terapêuticas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Link to={feature.href}>
                    <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 h-full group cursor-pointer">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center glow-soft group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {feature.title}
                              </h3>
                              <Badge variant="secondary" className="rounded-xl">
                                {feature.count}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Comece Sua Jornada na Aromaterapia
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Tenha acesso a conhecimentos validados e organizados sobre óleos essenciais e suas aplicações terapêuticas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/oleos">
                <Button size="lg" className="rounded-2xl px-8 py-6 text-lg">
                  Explorar Óleos Essenciais
                </Button>
              </Link>
              <Link to="/favoritos">
                <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Meus Favoritos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
