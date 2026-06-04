export default function UserCard({ systemUser, user }) {
  const nome = systemUser?.nome || user?.displayName || "Usuário";
  const email = systemUser?.email || user?.email || "";
  const inicial = nome?.[0]?.toUpperCase() || "U";

  return (
    <div className="
      bg-white/[0.04]
      border border-white/8
      rounded-2xl p-3
      flex items-center gap-3
    ">
      <div className="
        w-9 h-9 rounded-full shrink-0
        bg-gradient-to-br from-violet-500 to-blue-500
        flex items-center justify-center
        text-white text-sm font-bold
        shadow-lg shadow-violet-500/20
      ">
        {systemUser?.photo || user?.photoURL
          ? <img
              src={systemUser?.photo || user?.photoURL}
              alt={nome}
              className="w-9 h-9 rounded-full object-cover"
            />
          : inicial
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{nome}</p>
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>
    </div>
  );
}
