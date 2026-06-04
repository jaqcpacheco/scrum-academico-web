export default function TeamPerformance({

  members = []

}) {

  if (!members.length) {

    return (

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-semibold mb-4 text-white">

          Performance da Equipe

        </h2>

        <p className="text-slate-400">
          Nenhum membro encontrado.
        </p>

      </div>
    );
  }

  return (

    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-white">

          🚀 Performance da Equipe

        </h2>

        <span className="text-sm text-slate-400">

          {members.length} membros

        </span>

      </div>

      <div className="space-y-4">

        {[...members]

          .sort(
            (a, b) =>
              b.produtividade -
              a.produtividade
          )

          .map((member, index) => (

            <div
              key={member.id}
              className="bg-slate-800/60 border border-slate-700 rounded-xl p-4"
            >

              <div className="flex items-center justify-between mb-2">

                <div>

                  <h3 className="font-medium text-white">

                    #{index + 1} • {member.nome}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {member.tarefas} tarefas • {" "}
                    {member.concluidas} concluídas

                  </p>

                </div>

                <div className="text-right">

                  <span className="text-lg font-bold text-blue-400">

                    {member.produtividade}%

                  </span>

                </div>

              </div>

              {/* BARRA */}
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${member.produtividade}%`
                  }}
                />

              </div>

            </div>
          ))}

      </div>

    </div>
  );
}