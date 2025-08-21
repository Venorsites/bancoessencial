import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  CheckCircle,
  Users,
  MessageCircle,
  Mail,
  Instagram,
  Youtube,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const Index = () => {
  // ===== Nome do usuário para saudação =====
  const userName = useMemo(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "null");
      if (userObj?.name) return userObj.name;
    } catch (_) {}
    const alt = localStorage.getItem("name");
    return alt || "você";
  }, []);

  const contentCards = [
    {
      image:
        "https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp",
      title: "Banco de Dados - Óleos Essenciais (Fichas Completas)",
      description:
        "Base completa com propriedades e aplicações de centenas de óleos essenciais",
      href: "/oleos",
      color: "from-purple-400 to-purple-600",
    },
    {
      image:
        "https://i.ibb.co/N6Nq66d8/Guia-de-Consulta-Doen-as-Condi-es-x-leos-Essenciais-de-A-a-Z.webp",
      title:
        "Guia de Consulta - Doenças/Condições x Óleos Essenciais de A a Z",
      description:
        "Recomendações de óleos essenciais para diferentes condições de saúde",
      href: "/doencas",
      color: "from-pink-400 to-pink-600",
    },
    {
      image:
        "https://i.ibb.co/twk59f8d/DALLE-2024-11-19-17-34-33-A-wide-artistic-watercolor-representation-of-essential-oil-chemical-groups.webp",
      title: "Resumo dos principais grupos químicos",
      description:
        "Compreenda a química por trás dos óleos essenciais e suas propriedades",
      href: "/quimica",
      color: "from-green-400 to-green-600",
    },
    {
      image: "https://i.ibb.co/whpd6f5J/Banco-de-Conte-dos-Insta-da-Dai.webp",
      title: "Banco de Conteúdos - Insta da Dai",
      description: "Acesso organizado aos conteúdos educativos do Instagram",
      href: "/conteudos",
      color: "from-blue-400 to-blue-600",
    },
    {
      image:
        "https://i.ibb.co/b5SmSFzS/Chat-GPT-Image-9-de-abr-de-2025-17-30-51.webp",
      title: "Repositório de receitas e protocolos prontos [em construção]",
      description:
        "Coleção de receitas e protocolos para uso dos óleos essenciais",
      href: "/favoritos",
      color: "from-orange-400 to-orange-600",
    },
  ];

  const socialNetworks = [
    { icon: Instagram, handle: "@daianealaniz", color: "from-pink-400 to-pink-600" },
    { icon: MessageSquare, handle: "@daianealaniz", color: "from-blue-400 to-blue-600" },
    { icon: Youtube, handle: "@daianealaniz", color: "from-red-400 to-red-600" },
  ];

  const contacts = [
    { icon: MessageCircle, info: "(18) 98179-2777", color: "from-green-400 to-green-600" },
    { icon: Mail, info: "suporte@daianealaniz.com", color: "from-blue-400 to-blue-600" },
  ];

  const courses = [
    {
      title: "UPD - Um papo com a Dai",
      description: "Comunidade e mentoria em grupo",
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "MCE - Mente Corpo e Emoções",
      description: "Programa completo de bem-estar",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Mentoria Individual",
      description: "Acompanhamento personalizado",
      color: "from-violet-400 to-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width com imagem e caixa escura só atrás do texto ===== */}
      <section className="relative w-full h-24 sm:h-32 lg:h-40 flex items-center">
        <img
          src="https://i.ibb.co/xtPW4mv4/fundo.webp"
          alt="Banner aromaterapia"
          className="absolute inset-0 w-full h-full object-cover object-[center_91%]"
        />
      </section>

      {/* ===== Conteúdo principal ===== */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Conteúdos Section */}
          <section>
            <div className="section-header">
              <h2 className="section-title">
                <CheckCircle className="section-icon text-green-500" />
                Conteúdos
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Conteúdo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contentCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={card.href}>
                    <Card className="dashboard-card group flex flex-col overflow-hidden">
                      <div className="relative w-full aspect-[16/9]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      <div className="bg-white p-3 sm:p-4">
                        <h3 className="dashboard-title text-slate-800 group-hover:text-purple-600 transition-colors text-sm sm:text-base leading-tight text-left font-semibold line-clamp-2 mb-2">
                          {card.title}
                        </h3>
                        <p className="dashboard-description text-slate-600 text-xs sm:text-sm leading-snug text-left line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Courses and Mentorship Section */}
          <section>
            <div className="section-header">
              <h2 className="section-title">
                <Star className="section-icon text-yellow-500" />
                Minhas assinaturas, cursos e mentorias
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Cursos e mentorias
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="dashboard-card group h-28 sm:h-32">
                    <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col justify-center">
                      <div
                        className={`dashboard-icon bg-gradient-to-br ${course.color} mx-auto mb-2 sm:mb-3`}
                      >
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="dashboard-title mb-1 group-hover:text-purple-600 text-sm sm:text-base">
                        {course.title}
                      </h3>
                      <p className="dashboard-description text-xs sm:text-sm">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Redes sociais + Contatos lado a lado (abaixo das assinaturas) */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Coluna Redes Sociais */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">
                    <Users className="section-icon text-blue-500" />
                    Minhas redes sociais
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {socialNetworks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="dashboard-card group h-28 sm:h-32">
                          <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col justify-center">
                            <div
                              className={`dashboard-icon bg-gradient-to-br ${social.color} mx-auto mb-2 sm:mb-3`}
                            >
                              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <p className="font-medium text-slate-800 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                              {social.handle}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Coluna Contatos */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">
                    <MessageCircle className="section-icon text-green-500" />
                    Meus contatos
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {contacts.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="dashboard-card group h-28 sm:h-32">
                          <CardContent className="p-4 sm:p-6 h-full flex items-center">
                            <div
                              className={`dashboard-icon bg-gradient-to-br ${contact.color}`}
                            >
                              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <span className="font-medium text-slate-800 group-hover:text-purple-600 transition-colors ml-3 sm:ml-4 text-sm sm:text-lg">
                              {contact.info}
                            </span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
