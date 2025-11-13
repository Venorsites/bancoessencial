import { Link } from "react-router-dom";
import { Mail, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-banco-branca.svg";

export function Footer() {
  const socialNetworks = [
    { 
      image: "https://i.ibb.co/9mBdRXwM/pngtree-instagram-icon-instagram-logo-png-image-3584852.png", 
      handle: "@daianealaniz", 
      link: "https://www.instagram.com/daianealaniz/",
      name: "Instagram"
    },
    { 
      image: "https://i.ibb.co/1t3MS1Vp/youtube-logo-png-46017.png", 
      handle: "@daianealaniz", 
      link: "https://www.youtube.com/c/DaianeAlaniz",
      name: "YouTube"
    },
    { 
      image: "https://i.ibb.co/0yVVDf6D/tiktok-icon-free-png.png", 
      handle: "@daianealaniz", 
      link: "https://www.tiktok.com/@daianealaniz",
      name: "TikTok"
    },
  ];

  const contacts = [
    { 
      icon: MessageCircle, 
      info: "(18) 98179-2777", 
      type: "whatsapp",
      link: "https://wa.me/5518981792777?text=Olá, estou no Banco de Dados Essencial e gostaria de tirar uma dúvida!"
    },
    { 
      icon: Mail, 
      info: "suporte@daianealaniz.com", 
      type: "email",
      link: "mailto:suporte@daianealaniz.com?subject=Contato via Banco de Dados Essencial&body=Olá, estou no Banco de Dados Essencial e gostaria de tirar uma dúvida!"
    },
  ];

  return (
    <footer className="text-white mt-auto" style={{ backgroundColor: '#7d5fbb' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="Banco de Óleos Essenciais" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white text-sm">
              Base completa com propriedades e aplicações de centenas de óleos essenciais
            </p>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Redes Sociais</h3>
            <div className="flex flex-col space-y-3">
              {socialNetworks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-white hover:text-white transition-colors duration-200"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img 
                    src={social.image} 
                    alt={social.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm">{social.handle}</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contatos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contato</h3>
            <div className="flex flex-col space-y-3">
              {contacts.map((contact, index) => (
                <motion.a
                  key={contact.type}
                  href={contact.link}
                  target={contact.type === "email" ? "_self" : "_blank"}
                  rel={contact.type === "email" ? "" : "noopener noreferrer"}
                  className="flex items-center space-x-3 text-white hover:text-white transition-colors duration-200"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + socialNetworks.length) * 0.1 }}
                >
                  <contact.icon className="w-5 h-5 text-white" />
                  <span className="text-sm">{contact.info}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Meus Cursos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Meus Cursos</h3>
            <motion.a
              href="https://daianealaniz.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white hover:text-white transition-colors duration-200 group"
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (socialNetworks.length + contacts.length) * 0.1 }}
            >
              <span className="text-sm">Acesse meus cursos e formações</span>
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform text-white" />
            </motion.a>
            <p className="text-white text-xs mt-2">
              Cursos completos sobre aromaterapia, óleos essenciais e bem-estar
            </p>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-white text-sm text-center md:text-left">
                © {new Date().getFullYear()} Banco de Dados Essencial. Todos os direitos reservados.
              </p>
              <Link 
                to="/politica-e-termos" 
                className="text-white text-sm underline hover:text-purple-200 transition-colors"
              >
                Política de Privacidade e Termos de Uso
              </Link>
            </div>
            <p className="text-white text-sm text-center md:text-right">
              Desenvolvido com ❤️ para a comunidade de aromaterapia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

