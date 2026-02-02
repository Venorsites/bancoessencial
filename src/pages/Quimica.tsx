import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beaker, FlaskConical, Atom, X } from "lucide-react";

const chemicalGroups = [
  {
    id: 1,
    name: "Monoterpenos",
    icon: FlaskConical,
    color: "from-blue-400 to-blue-600",
    description: "Compostos voláteis com propriedades estimulantes e antimicrobianas.",
    properties: ["Estimulante", "Antimicrobiano", "Antiviral", "Descongestionante"],
    examples: ["Limoneno", "Pineno", "Sabineno", "Mirceno"],
    oils: ["Limão", "Pinho", "Cipreste", "Junípero"],
    effects: "Energizante e purificante",
  },
  {
    id: 2,
    name: "Sesquiterpenos",
    icon: Atom,
    color: "from-green-400 to-green-600",
    description: "Moléculas maiores com ação anti-inflamatória e calmante no sistema nervoso.",
    properties: ["Anti-inflamatório", "Calmante", "Sedativo", "Regenerador"],
    examples: ["Chamazuleno", "Bisabolol", "Cadineno", "Cariofileno"],
    oils: ["Camomila", "Sândalo", "Vetiver", "Ylang Ylang"],
    effects: "Relaxante e regenerativo",
  },
  {
    id: 3,
    name: "Ésteres",
    icon: Beaker,
    color: "from-purple-400 to-purple-600",
    description: "Compostos suaves com propriedades calmantes e antiespasmódicas.",
    properties: ["Calmante", "Antiespasmódico", "Sedativo", "Relaxante"],
    examples: ["Acetato de Linalila", "Acetato de Geranila", "Acetato de Lavandila"],
    oils: ["Lavanda", "Bergamota", "Petitgrain", "Salvia"],
    effects: "Equilibrante e harmonizante",
  },
  {
    id: 4,
    name: "Álcoois",
    icon: FlaskConical,
    color: "from-orange-400 to-orange-600",
    description: "Compostos seguros com propriedades antimicrobianas e tonificantes.",
    properties: ["Antimicrobiano", "Tonificante", "Equilibrante", "Regenerador"],
    examples: ["Linalol", "Geraniol", "Mentol", "Borneol"],
    oils: ["Rosa", "Gerânio", "Hortelã", "Alecrim"],
    effects: "Tonificante e equilibrante",
  },
  {
    id: 5,
    name: "Aldeídos",
    icon: Atom,
    color: "from-yellow-400 to-yellow-600",
    description: "Compostos aromáticos com propriedades sedativas e anti-inflamatórias.",
    properties: ["Sedativo", "Anti-inflamatório", "Calmante", "Antifúngico"],
    examples: ["Citral", "Citronelal", "Benzaldeído"],
    oils: ["Capim-limão", "Melissa", "Citronela"],
    effects: "Calmante e purificante",
  },
  {
    id: 6,
    name: "Óxidos",
    icon: Beaker,
    color: "from-teal-400 to-teal-600",
    description: "Compostos com forte ação expectorante e antimicrobiana.",
    properties: ["Expectorante", "Antimicrobiano", "Mucolítico", "Descongestionante"],
    examples: ["1,8-Cineol (Eucaliptol)", "Óxido de Rosa", "Ascaridol"],
    oils: ["Eucalipto", "Tea Tree", "Cajeput", "Ravensara"],
    effects: "Purificante e respiratório",
  },
];

export default function Quimica() {
  const [selectedGroup, setSelectedGroup] = useState<typeof chemicalGroups[0] | null>(null);

  const openGroupModal = (group: typeof chemicalGroups[0]) => {
    setSelectedGroup(group);
  };

  const closeGroupModal = () => {
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/twk59f8d/DALLE-2024-11-19-17-34-33-A-wide-artistic-watercolor-representation-of-essential-oil-chemical-groups.webp"
          alt="Banner Grupos e Famílias Químicas"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Grupos e Famílias Químicas
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Compreenda a química dos óleos essenciais e como diferentes grupos de compostos influenciam suas propriedades terapêuticas.
        </p>
      </motion.div>

      {/* Chemical Groups Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {chemicalGroups.map((group, index) => {
          const IconComponent = group.icon;
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card 
                className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 h-full border-2 border-purple-200 cursor-pointer"
                onClick={() => openGroupModal(group)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center glow-soft`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {group.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {group.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Properties */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                      Propriedades Principais
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.properties.map((property) => (
                        <Badge 
                          key={property} 
                          variant="secondary" 
                          className="rounded-xl text-white"
                        >
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Chemical Examples */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span>
                      Compostos Principais
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.examples.map((example) => (
                        <Badge 
                          key={example} 
                          variant="outline" 
                          className="rounded-xl text-xs text-black"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Example Oils */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-accent mr-2"></span>
                      Óleos Exemplares
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.oils.map((oil) => (
                        <Badge 
                          key={oil} 
                          variant="default" 
                          className="rounded-xl text-white"
                        >
                          {oil}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Effects */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${group.color} bg-opacity-10 border border-border/50`}>
                    <h4 className="font-semibold text-foreground mb-2">
                      Efeito Característico
                    </h4>
                    <p className="text-muted-foreground">
                      {group.effects}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Educational Note */}
      <motion.div 
        className="mt-12 p-8 rounded-3xl bg-muted/50 border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
          💡 Nota Educativa
        </h3>
        <p className="text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
          A composição química dos óleos essenciais determina suas propriedades terapêuticas. 
          Compreender esses grupos químicos ajuda na seleção correta dos óleos para diferentes 
          necessidades de bem-estar e saúde. Sempre consulte um aromaterapeuta qualificado 
          para orientações específicas.
        </p>
              </motion.div>

        {/* Chemical Group Detail Modal */}
        <AnimatePresence>
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={closeGroupModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedGroup.color} flex items-center justify-center glow-soft`}>
                          <selectedGroup.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-foreground mb-2">
                            {selectedGroup.name}
                          </h2>
                          <p className="text-muted-foreground text-lg">
                            {selectedGroup.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeGroupModal}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-8">
                  {/* Properties */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-xl flex items-center">
                      <span className="w-3 h-3 rounded-full bg-primary mr-3"></span>
                      Propriedades Principais
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedGroup.properties.map((property) => (
                        <Badge 
                          key={property} 
                          variant="secondary" 
                          className="rounded-xl text-white text-sm px-4 py-2"
                        >
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Chemical Examples */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-xl flex items-center">
                      <span className="w-3 h-3 rounded-full bg-secondary mr-3"></span>
                      Compostos Principais
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedGroup.examples.map((example) => (
                        <Badge 
                          key={example} 
                          variant="outline" 
                          className="rounded-xl text-sm px-4 py-2 text-black"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Example Oils */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-xl flex items-center">
                      <span className="w-3 h-3 rounded-full bg-accent mr-3"></span>
                      Óleos Exemplares
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedGroup.oils.map((oil) => (
                        <Badge 
                          key={oil} 
                          variant="default" 
                          className="rounded-xl text-white text-sm px-4 py-2"
                        >
                          {oil}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Effects */}
                  <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedGroup.color} bg-opacity-10 border border-border/50`}>
                    <h3 className="font-semibold text-foreground mb-3 text-xl">
                      Efeito Característico
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {selectedGroup.effects}
                    </p>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-muted/30 p-6 rounded-2xl">
                    <h3 className="font-semibold text-foreground mb-3 text-xl">
                      💡 Informações Adicionais
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Este grupo químico é fundamental para compreender as propriedades terapêuticas dos óleos essenciais. 
                      A composição química determina não apenas os benefícios, mas também as precauções necessárias 
                      para uso seguro e eficaz.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}