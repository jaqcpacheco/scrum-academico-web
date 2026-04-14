import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  Clock,
  List
} from "lucide-react";

export default function Card({ title, value }) {

  // 🎯 CONFIG DINÂMICA
  const config = {
    "Total": {
      icon: <List />,
      extra: "Total de tarefas no board",
      color: "text-slate-400",
      trend: "up"
    },

    "Backlog": {
      icon: <Clock />,
      extra: "Tarefas pendentes",
      color: "text-yellow-400",
      trend: "up"
    },

    "Em andamento": {
      icon: <Activity />,
      extra: "Tarefas em execução",
      color: "text-blue-400",
      trend: "up"
    },

    "Concluídas": {
      icon: <CheckCircle />,
      extra: "Tarefas finalizadas",
      color: "text-green-400",
      trend: "up"
    },

    "Produtividade": {
      icon: <Activity />,
      extra: "Eficiência do time",
      color: "text-green-400",
      trend: "up"
    },

    "Lead Time": {
      icon: <Clock />,
      extra: "Tempo médio de entrega",
      color: "text-orange-400",
      trend: "down"
    }
  };

  const item = config[title] || {
    icon: <Activity />,
    extra: "",
    color: "text-slate-400",
    trend: "up"
  };

  return (
    <div
      className="
        bg-slate-900/50
        border border-slate-800
        rounded-2xl
        p-5
        flex flex-col gap-4
        backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-lg
      "
    >

  
      <div className="flex items-center justify-between">

        <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
          {item.icon}
        </div>

        {item.trend === "up" ? (
          <ArrowUpRight className="text-green-400" />
        ) : (
          <ArrowDownRight className="text-red-400" />
        )}
      </div>

    
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      
      <h2 className="text-3xl font-bold text-white">
        {value}
      </h2>

      
      <p className={`text-sm ${item.color}`}>
        {item.extra}
      </p>

    </div>
  );
}