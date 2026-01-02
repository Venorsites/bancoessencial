import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Star, 
  Sparkles, 
  BookOpen, 
  Search, 
  Heart, 
  Beaker, 
  ShieldCheck,
  Users,
  Crown,
  Zap,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo-banco.svg";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: BookOpen,
      title: "Banco Completo de Óleos",
      description: "Acesso a centenas de óleos essenciais com informações detalhadas sobre propriedades, indicações e contraindicações"
    },
    {
      icon: Search,
      title: "Busca Inteligente",
      description: "Encontre rapidamente o óleo ideal para cada situação através de filtros avançados e busca por propriedades terapêuticas"
    },
    {
      icon: Beaker,
      title: "Formulações Testadas",
      description: "Receitas e sinergias prontas, desenvolvidas por aromaterapeuta com anos de experiência prática"
    },
    {
      icon: Heart,
      title: "Protocolos por Doença",
      description: "Protocolos específicos para doenças gerais, gestação, menopausa e pediatria com dosagens seguras"
    },
    {
      icon: ShieldCheck,
      title: "Informação Científica",
      description: "Conteúdo baseado em evidências científicas, com referências e estudos atualizados"
    },
    {
      icon: Sparkles,
      title: "Atualizações Constantes",
      description: "Novos óleos, receitas e protocolos adicionados regularmente para manter você sempre atualizado"
    }
  ];

  const plans = {
    monthly: {
      name: "Mensal",
      price: 49.90,
      period: "/mês",
      description: "Ideal para começar sua jornada",
      features: [
        "Acesso completo ao banco de óleos",
        "Todas as receitas e formulações",
        "Protocolos por doença",
        "Busca avançada",
        "Sistema de favoritos",
        "Suporte por email",
      ],
      notIncluded: [
        "Desconto no valor mensal",
        "Economia de R$ 240,00/ano"
      ]
    },
    annual: {
      name: "Anual",
      price: 358.80,
      period: "/ano",
      pricePerMonth: 29.90,
      description: "Melhor custo-benefício",
      badge: "MAIS POPULAR",
      savings: "Economize R$ 240,00",
      features: [
        "Acesso completo ao banco de óleos",
        "Todas as receitas e formulações",
        "Protocolos por doença",
        "Busca avançada",
        "Sistema de favoritos",
        "Suporte prioritário",
        "40% de desconto",
        "Apenas R$ 29,90/mês",
      ],
      notIncluded: []
    }
  };

  const testimonials = [
    {
      name: "Dra. Mariana Silva",
      role: "Aromaterapeuta",
      photo: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "O Banco Essencial revolucionou minha prática clínica. Ter acesso rápido a informações confiáveis sobre cada óleo me dá muito mais segurança nas formulações."
    },
    {
      name: "Paula Costa",
      role: "Terapeuta Holística",
      photo: "https://i.pravatar.cc/150?img=9",
      rating: 5,
      text: "Indispensável! As receitas prontas me economizam horas de pesquisa e os protocolos por doença são extremamente práticos no dia a dia."
    },
    {
      name: "Ricardo Oliveira",
      role: "Estudante de Aromaterapia",
      photo: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Como estudante, ter um banco de dados tão completo e organizado facilita muito meu aprendizado. Vale cada centavo!"
    }
  ];

  const faqs = [
    {
      question: "Como funciona o acesso após a compra?",
      answer: "Após a confirmação do pagamento, você receberá um email com suas credenciais de acesso. O login é liberado automaticamente e você pode começar a usar imediatamente."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim! Não há fidelidade. Você pode cancelar sua assinatura quando quiser através do painel de usuário ou entrando em contato conosco."
    },
    {
      question: "O conteúdo é atualizado?",
      answer: "Sim! Estamos constantemente adicionando novos óleos, receitas e atualizando informações baseadas nas pesquisas mais recentes em aromaterapia."
    },
    {
      question: "Há garantia de reembolso?",
      answer: "Sim, oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu investimento, sem perguntas."
    },
    {
      question: "O plano anual vale a pena?",
      answer: "Definitivamente! Com o plano anual você economiza R$ 240,00 (40% de desconto) e garante acesso por um ano inteiro por menos de R$ 30/mês."
    },
    {
      question: "Preciso ter conhecimento prévio em aromaterapia?",
      answer: "Não necessariamente. O conteúdo é organizado de forma clara e didática, adequado tanto para iniciantes quanto para profissionais experientes."
    }
  ];

  const currentPlan = plans[billingCycle];

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Banco Essencial" className="h-16 w-auto md:h-20" />
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-purple-700 hover:text-purple-900">
                  Entrar
                </Button>
              </Link>
              <Button 
                onClick={scrollToPlans}
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-purple-100 text-purple-800 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Mais de 1.000 profissionais confiam em nós
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              O Banco de Dados Completo de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 mt-2">
                Óleos Essenciais
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tenha acesso instantâneo a informações científicas sobre centenas de óleos essenciais, 
              receitas testadas e protocolos terapêuticos. Tudo em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg"
                onClick={scrollToPlans}
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-6 text-lg"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg"
              >
                Ver Demonstração
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Sem fidelidade</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Acesso imediato</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl" />
              <img 
                src="/hero-background.jpg" 
                alt="Preview do sistema"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos desenvolvidos especialmente para profissionais e estudantes de aromaterapia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-purple-100">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Investimento acessível para transformar sua prática profissional
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-purple-100 rounded-full p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-purple-900 shadow-md"
                    : "text-purple-700"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                  billingCycle === "annual"
                    ? "bg-white text-purple-900 shadow-md"
                    : "text-purple-700"
                }`}
              >
                Anual
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                  -40%
                </Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full ${billingCycle === "monthly" ? "border-purple-300 shadow-xl" : "border-gray-200"}`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plans.monthly.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plans.monthly.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        R$ {plans.monthly.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full mb-6 ${
                      billingCycle === "monthly"
                        ? "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    size="lg"
                  >
                    Começar Agora
                  </Button>

                  <div className="space-y-3">
                    {plans.monthly.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plans.monthly.notIncluded.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 opacity-50">
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Annual Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full relative ${billingCycle === "annual" ? "border-purple-500 shadow-2xl" : "border-gray-200"}`}>
                {plans.annual.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-1 text-sm">
                      <Crown className="w-4 h-4 mr-1" />
                      {plans.annual.badge}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plans.annual.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{plans.annual.description}</p>
                    <Badge className="bg-green-100 text-green-800 mb-4">
                      {plans.annual.savings}
                    </Badge>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl font-bold text-purple-600">
                        R$ {plans.annual.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-gray-600">/ano</span>
                    </div>
                    <p className="text-purple-600 font-semibold">
                      Apenas R$ {plans.annual.pricePerMonth?.toFixed(2).replace('.', ',')}/mês
                    </p>
                  </div>

                  <Button 
                    className={`w-full mb-6 ${
                      billingCycle === "annual"
                        ? "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    size="lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Começar Agora
                  </Button>

                  <div className="space-y-3">
                    {plans.annual.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Garantia de 7 Dias
                  </h3>
                </div>
                <p className="text-gray-700">
                  Experimente sem riscos. Se não ficar satisfeito, devolvemos 100% do seu investimento.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              O que dizem nossos usuários
            </h2>
            <p className="text-xl text-gray-600">
              Profissionais que transformaram sua prática com o Banco Essencial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.photo} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o Banco Essencial
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFaq === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-gray-600 mt-4"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-purple-400">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto para transformar sua prática?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Junte-se a mais de 1.000 profissionais que já utilizam o Banco Essencial
            </p>
            <Button 
              size="lg"
              onClick={scrollToPlans}
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-purple-100 mt-4 text-sm">
              Garantia de 7 dias • Sem fidelidade • Acesso imediato
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={logo} alt="Banco Essencial" className="h-16 w-auto md:h-20 mb-4" />
              <p className="text-gray-400 text-sm">
                O banco de dados mais completo de óleos essenciais do Brasil
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><Link to="/politica-termos" className="hover:text-white transition-colors">Termos</Link></li>
                <li><Link to="/politica-termos" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:suporte@daianealaniz.com" className="hover:text-white transition-colors">Email</a></li>
                <li><a href="https://wa.me/5518981792777" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal do Cliente</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Banco Essencial. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

