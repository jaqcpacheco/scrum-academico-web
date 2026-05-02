import {
  Activity,
  Clock,
  CheckCircle,
  TrendingUp,
  List
} from "lucide-react";

export default function Card({ title, value }) {

  const config = {
    "Total de Tarefas": {
      icon: <List />,
      desc: "Volume total",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },

    "Backlog": {
      icon: <Clock />,
      desc: "Tarefas pendentes",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },

    "Em Progresso": {
      icon: <Activity />,
      desc: "Em execução",
      color: "text-red-400",
      bg: "bg-red-500/10"
    },

    "Concluídas": {
      icon: <CheckCircle />,
      desc: "Finalizadas",
      color: "text-green-400",
      bg: "bg-green-500/10"
    },

    "Produtividade": {
      icon: <TrendingUp />,
      desc: "Eficiência do time",
      color: "text-green-400",
      bg: "bg-green-500/10"
    },

    "WIP": {
      icon: <Activity />,
      desc: "Work in progress",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },

    "Eficiência": {
      icon: <TrendingUp />,
      desc: "Throughput",
      color: "text-green-400",
      bg: "bg-green-500/10"
    }
  };

  const item = config[title] || {
    icon: <Activity />,
    desc: "",
    color: "text-slate-400",
    bg: "bg-slate-500/10"
  };

  return (
    <div className="
      bg-slate-900/60
      border border-slate-800
      rounded-2xl
      p-5
      flex flex-col gap-4
      backdrop-blur-md
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-xl
    ">

    
      <div className="flex justify-between items-center">

        <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
          {item.icon}
        </div>

        <span className="text-green-400 text-sm font-medium">
          ↗
        </span>

      </div>

      
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      
      <h2 className="text-3xl font-bold text-white">
        {value}
      </h2>

      
      <p className={`text-sm ${item.color}`}>
        {item.desc}
      </p>

    </div>
  );
}