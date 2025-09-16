import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  CheckCircle,
  Users,
  MessageCircle,
  Mail,
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
    { 
      image: "https://i.ibb.co/9mBdRXwM/pngtree-instagram-icon-instagram-logo-png-image-3584852.png", 
      handle: "@daianealaniz", 
      link: "https://www.instagram.com/daianealaniz/",
      color: "from-pink-400 to-pink-600" 
    },
    { 
      image: "https://i.ibb.co/1t3MS1Vp/youtube-logo-png-46017.png", 
      handle: "@daianealaniz", 
      link: "https://www.youtube.com/c/DaianeAlaniz",
      color: "from-red-400 to-red-600" 
    },
    { 
      image: "https://i.ibb.co/0yVVDf6D/tiktok-icon-free-png.png", 
      handle: "@daianealaniz", 
      link: "https://www.tiktok.com/@daianealaniz",
      color: "from-gray-400 to-gray-600" 
    },
  ];

  const contacts = [
    { 
      icon: MessageCircle, 
      info: "(18) 98179-2777", 
      color: "from-green-400 to-green-600",
      type: "whatsapp",
      link: "https://wa.me/5518981792777?text=Olá, estou no Banco de Dados e gostaria de tirar uma dúvida!"
    },
    { 
      icon: Mail, 
      info: "suporte@daianealaniz.com", 
      color: "from-blue-400 to-blue-600",
      type: "email",
      link: "mailto:suporte@daianealaniz.com?subject=Contato via Banco de Dados&body=Olá, estou no Banco de Dados e gostaria de tirar uma dúvida!"
    },
  ];

  const courses = [
    {
      title: "UPD - Um papo com a Dai",
      description: "Comunidade e mentoria em grupo",
      image: "https://daianealaniz.com.br/wp-content/webp-express/webp-images/uploads/2025/01/2.png.webp",
    },
    {
      title: "MCE - Mente Corpo e Emoções",
      description: "Programa completo de bem-estar",
      image: "https://daianealaniz.com.br/wp-content/webp-express/webp-images/uploads/2025/01/1.png.webp",
    },
    {
      title: "Mentoria Individual",
      description: "Acompanhamento personalizado",
      image: "https://daianealaniz.com.br/wp-content/webp-express/webp-images/uploads/2025/01/fafafa.png.webp",
    },
    {
      title: "Daiane Link na Bio",
      description: "Conteúdo exclusivo",
      image: "https://daianealaniz.com.br/wp-content/webp-express/webp-images/uploads/2025/08/Daiane-Link-na-bio.png.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width com imagem ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40 flex items-center">
        <img
          src="https://i.ibb.co/xtPW4mv4/fundo.webp"
          alt="Banner aromaterapia"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_91%]"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Redes sociais + Contatos lado a lado (abaixo das assinaturas) */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Coluna Redes Sociais */}
              <div>
                <div className="section-header mb-2">
                  <h2 className="section-title">
                    <Users className="section-icon text-blue-500" />
                    Minhas redes sociais
                  </h2>
                </div>
                <p className="text-slate-600 text-sm mb-6">Siga-me para dicas diárias e conteúdo exclusivo</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {socialNetworks.map((social, index) => {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <a 
                          href={social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="dashboard-card group h-32 sm:h-36 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                            <CardContent className="p-5 sm:p-6 text-center h-full flex flex-col justify-center">
                              <div className="mx-auto mb-3 sm:mb-4 p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <img 
                                  src={social.image} 
                                  alt={social.handle}
                                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                />
                              </div>
                              <p className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                                {social.handle}
                              </p>
                              <p className="text-slate-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Clique para acessar
                              </p>
                            </CardContent>
                          </Card>
                        </a>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Coluna Contatos */}
              <div>
                <div className="section-header mb-2">
                  <h2 className="section-title">
                    <MessageCircle className="section-icon text-green-500" />
                    Meus contatos
                  </h2>
                </div>
                <p className="text-slate-600 text-sm mb-6">Entre em contato para dúvidas e suporte</p>

                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {contacts.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <a 
                          href={contact.link} 
                          target={contact.type === "email" ? "_self" : "_blank"} 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="dashboard-card group h-32 sm:h-36 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                            <CardContent className="p-5 sm:p-6 h-full flex items-center">
                              <div
                                className={`dashboard-icon bg-gradient-to-br ${contact.color} p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300`}
                              >
                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                              </div>
                              <div className="ml-4 sm:ml-5 flex-1">
                                <span className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors text-sm sm:text-base block">
                                  {contact.info}
                                </span>
                                <p className="text-slate-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {contact.type === "whatsapp" ? "Clique para abrir WhatsApp" : "Clique para enviar e-mail"}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
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
