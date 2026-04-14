import {
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Clock
} from "lucide-react";

export default function InsightCard({ tipo, texto }) {

  const estilos = {
    positivo: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-300",
      icon: <CheckCircle className="w-5 h-5" />
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-300",
      icon: <Info className="w-5 h-5" />
    },
    destaque: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-300",
      icon: <TrendingUp className="w-5 h-5" />
    },
    alerta: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-300",
      icon: <Clock className="w-5 h-5" />
    },
    aviso: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-300",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    critico: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-300",
      icon: <AlertTriangle className="w-5 h-5" />
    }
  };

  const estilo = estilos[tipo];

  return (
    <div
      className={`
        flex items-center gap-4
        p-5 rounded-2xl border
        ${estilo.bg} ${estilo.border}
        backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-lg
      `}
    >
      
      <div className={`p-2 rounded-lg ${estilo.text}`}>
        {estilo.icon}
      </div>

      
      <p className={`text-sm leading-relaxed ${estilo.text}`}>
        {texto}
      </p>
    </div>
  );
}