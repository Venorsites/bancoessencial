import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const aromaterapiaCategories = [
  {
    id: "geral",
    title: "Geral",
    description: "Guia completo de doenças e condições com recomendações de óleos essenciais para saúde geral e bem-estar.",
    image: "https://i.ibb.co/PZV5LwsL/Geral.webp",
    href: "/doencas/geral",
    isFavorite: false,
  },
  {
    id: "pediatrica",
    title: "Aromaterapia Pediátrica",
    description: "Especializada em cuidados com crianças, incluindo dosagens seguras e aplicações específicas para cada idade.",
    image: "https://i.ibb.co/dstvpWyH/Pediatra.webp",
    href: "/doencas/pediatrica",
    isFavorite: false,
  },
  {
    id: "gestacao",
    title: "Aromaterapia na Gestação",
    description: "Focada na saúde da gestante e do bebê, com óleos seguros para uso durante a gravidez e pós-parto.",
    image: "https://i.ibb.co/TxSnpWrJ/gesta-o.webp",
    href: "/doencas/gestacao",
    isFavorite: false,
  },
  {
    id: "menopausa",
    title: "Aromaterapia na Menopausa",
    description: "Especializada em sintomas da menopausa, equilíbrio hormonal e bem-estar durante esta fase da vida.",
    image: "https://i.ibb.co/ynyCdJWG/menopausa.webp",
    href: "/doencas/menopausa",
    isFavorite: false,
  },
];

export default function Doencas() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/PZV5LwsL/Geral.webp"
          alt="Banner Guia de Doenças"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="text-left mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Doenças x Óleos Essenciais de A a Z
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Escolha uma categoria para encontrar recomendações específicas de óleos essenciais para diferentes condições de saúde.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {aromaterapiaCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="flex"
            >
              <Link to={category.href} className="w-full">
                <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 group cursor-pointer overflow-hidden h-full w-full flex flex-col">
                {/* Image */}
                <div className="relative h-36 sm:h-40 lg:h-44 overflow-hidden flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                </div>

                {/* Content */}
                <CardHeader className="pb-3 px-4 pt-4 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-purple-600 transition-colors mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardHeader>

                {/* Action */}
                <CardContent className="pt-0 px-4 pb-4 flex-shrink-0">
                  <Button 
                    className="w-full rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors text-sm sm:text-base"
                    variant="outline"
                  >
                    Acessar Guia
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
                </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada categoria contém um guia completo com busca por letras, filtros e recomendações específicas de óleos essenciais para as condições relacionadas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}