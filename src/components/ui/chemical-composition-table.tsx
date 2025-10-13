import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface ChemicalComponent {
  id: string;
  componente: string;
  familia: string;
  concentracao: string;
}

interface ChemicalCompositionTableProps {
  value: ChemicalComponent[];
  onChange: (components: ChemicalComponent[]) => void;
  className?: string;
}

export function ChemicalCompositionTable({ 
  value = [], 
  onChange, 
  className 
}: ChemicalCompositionTableProps) {
  const [components, setComponents] = useState<ChemicalComponent[]>(value);

  const addComponent = () => {
    const newComponent: ChemicalComponent = {
      id: Date.now().toString(),
      componente: "",
      familia: "",
      concentracao: ""
    };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    onChange(updatedComponents);
  };

  const removeComponent = (id: string) => {
    const updatedComponents = components.filter(comp => comp.id !== id);
    setComponents(updatedComponents);
    onChange(updatedComponents);
  };

  const updateComponent = (id: string, field: keyof ChemicalComponent, newValue: string) => {
    const updatedComponents = components.map(comp => 
      comp.id === id ? { ...comp, [field]: newValue } : comp
    );
    setComponents(updatedComponents);
    onChange(updatedComponents);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-purple-800">
            Composição Química Majoritária
          </CardTitle>
          <Button
            type="button"
            onClick={addComponent}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Componente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {components.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum componente químico adicionado.</p>
            <p className="text-sm">Clique em "Adicionar Componente" para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-700 border-b pb-2">
              <div className="col-span-4">Componente Químico</div>
              <div className="col-span-4">Família Química</div>
              <div className="col-span-3">Concentração</div>
              <div className="col-span-1">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {components.map((component, index) => (
              <div key={component.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <Input
                    value={component.componente}
                    onChange={(e) => updateComponent(component.id, 'componente', e.target.value)}
                    placeholder="Ex: 1,8-cineol"
                    className="text-sm"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={component.familia}
                    onChange={(e) => updateComponent(component.id, 'familia', e.target.value)}
                    placeholder="Ex: Óxido terpênico"
                    className="text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={component.concentracao}
                    onChange={(e) => updateComponent(component.id, 'concentracao', e.target.value)}
                    placeholder="Ex: 38 - 55%"
                    className="text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent(component.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
