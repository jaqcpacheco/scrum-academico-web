import {
  CheckCircle,
  AlertTriangle,
  Bot,
  Sparkles,
  TrendingUp,
  ShieldAlert
} from "lucide-react";

export default function InsightsPanel({
  metrics
}) {

  if (!metrics) return null;

  const positivos = [];
  const gargalos = [];

  if (metrics.produtividade > 70) {

    positivos.push(
      "Produtividade da equipe está acima do esperado"
    );
  }

  if (
    metrics.concluidas >
    metrics.emAndamento
  ) {

    positivos.push(
      "Boa taxa de conclusão de tarefas"
    );
  }

  if (metrics.eficiencia > 1) {

    positivos.push(
      "Equipe operando com eficiência"
    );
  }

  if (
    metrics.wip <= 5
  ) {

    positivos.push(
      "Fluxo WIP saudável"
    );
  }

  if (
    metrics.backlog >
    metrics.emAndamento
  ) {

    gargalos.push(
      "Backlog elevado pode gerar acúmulo de tarefas"
    );
  }

  if (
    metrics.emAndamento >
    metrics.concluidas
  ) {

    gargalos.push(
      "Muitas tarefas em andamento — risco de sobrecarga"
    );
  }

  if (metrics.wip > 5) {

    gargalos.push(
      "Alto WIP pode impactar produtividade"
    );
  }

  const texto =
    metrics.insight || "";

  const getSection = (
    start,
    end
  ) => {

    const startIndex =
      texto.indexOf(start);

    if (startIndex === -1)
      return "";

    const from =
      startIndex + start.length;

    const endIndex =
      end
        ? texto.indexOf(end, from)
        : -1;

    return (
      endIndex === -1

        ? texto.substring(from)

        : texto.substring(
            from,
            endIndex
          )
    ).trim();
  };

  const resumo =
    getSection(
      "Resumo:",
      "Insight:"
    );

  const insightTexto =
    getSection(
      "Insight:",
      "Recomendação:"
    );

  const recomendacao =
    getSection(
      "Recomendação:",
      null
    );

  return (

    <div className="mt-12">

      {/* HEADER */}
      <div className="
        flex items-center
        gap-3
        mb-8
      ">

        <div className="
          w-12 h-12
          rounded-2xl
          bg-gradient-to-br
          from-violet-500/20
          to-cyan-500/20
          border border-violet-500/20
          flex items-center
          justify-center
        ">

          <Bot
            size={22}
            className="
              text-violet-400
            "
          />

        </div>

        <div>

          <h2 className="
            text-3xl
            font-bold
            text-white
          ">

            AI Insights

          </h2>

          <p className="
            text-slate-400
            text-sm
          ">

            Inteligência analítica em tempo real

          </p>

        </div>

      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        <div className="
          bg-slate-900/50
          border border-white/5
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <div className="
            flex items-center
            gap-3
            mb-6
          ">

            <div className="
              w-10 h-10
              rounded-xl
              bg-emerald-500/10
              flex items-center
              justify-center
            ">

              <TrendingUp
                size={18}
                className="
                  text-emerald-400
                "
              />

            </div>

            <div>

              <h3 className="
                text-white
                font-semibold
              ">

                Pontos Positivos

              </h3>

              <p className="
                text-slate-400
                text-sm
              ">

                Indicadores favoráveis

              </p>

            </div>

          </div>

          <div className="
            space-y-4
          ">

            {positivos.length === 0 ? (

              <p className="
                text-slate-400
                text-sm
              ">

                Nenhum destaque positivo identificado

              </p>

            ) : (

              positivos.map((
                item,
                index
              ) => (

                <div
                  key={index}
                  className="
                    flex items-start
                    gap-3
                    p-4
                    rounded-2xl
                    bg-emerald-500/10
                    border border-emerald-500/20
                  "
                >

                  <CheckCircle
                    size={18}
                    className="
                      text-emerald-400
                      mt-0.5
                    "
                  />

                  <span className="
                    text-sm
                    text-emerald-200
                    leading-relaxed
                  ">

                    {item}

                  </span>

                </div>

              ))
            )}

          </div>

        </div>

        <div className="
          bg-slate-900/50
          border border-white/5
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <div className="
            flex items-center
            gap-3
            mb-6
          ">

            <div className="
              w-10 h-10
              rounded-xl
              bg-orange-500/10
              flex items-center
              justify-center
            ">

              <ShieldAlert
                size={18}
                className="
                  text-orange-400
                "
              />

            </div>

            <div>

              <h3 className="
                text-white
                font-semibold
              ">

                Gargalos Potenciais

              </h3>

              <p className="
                text-slate-400
                text-sm
              ">

                Alertas identificados pela IA

              </p>

            </div>

          </div>

          <div className="
            space-y-4
          ">

            {gargalos.length === 0 ? (

              <p className="
                text-slate-400
                text-sm
              ">

                Nenhum gargalo identificado

              </p>

            ) : (

              gargalos.map((
                item,
                index
              ) => (

                <div
                  key={index}
                  className="
                    flex items-start
                    gap-3
                    p-4
                    rounded-2xl
                    bg-orange-500/10
                    border border-orange-500/20
                  "
                >

                  <AlertTriangle
                    size={18}
                    className="
                      text-orange-400
                      mt-0.5
                    "
                  />

                  <span className="
                    text-sm
                    text-orange-200
                    leading-relaxed
                  ">

                    {item}

                  </span>

                </div>

              ))
            )}

          </div>

        </div>

      </div>

      {metrics.insight && (

        <div className="
          mt-6
          bg-gradient-to-br
          from-violet-500/10
          to-cyan-500/5
          border border-violet-500/10
          rounded-3xl
          p-8
          backdrop-blur-xl
        ">

          <div className="
            flex items-center
            gap-3
            mb-8
          ">

            <div className="
              w-12 h-12
              rounded-2xl
              bg-violet-500/10
              flex items-center
              justify-center
            ">

              <Sparkles
                size={20}
                className="
                  text-violet-400
                "
              />

            </div>

            <div>

              <h3 className="
                text-white
                font-semibold
                text-xl
              ">

                Análise Inteligente

              </h3>

              <p className="
                text-slate-400
                text-sm
              ">

                Insights gerados automaticamente

              </p>

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          ">

            <div className="
              bg-white/[0.03]
              border border-white/5
              rounded-2xl
              p-5
            ">

              <p className="
                text-violet-400
                font-semibold
                mb-3
              ">

                Resumo

              </p>

              <p className="
                text-slate-300
                text-sm
                leading-relaxed
              ">

                {resumo || texto}

              </p>

            </div>

            <div className="
              bg-white/[0.03]
              border border-white/5
              rounded-2xl
              p-5
            ">

              <p className="
                text-cyan-400
                font-semibold
                mb-3
              ">

                Insight

              </p>

              <p className="
                text-slate-300
                text-sm
                leading-relaxed
              ">

                {insightTexto || "—"}

              </p>

            </div>

            <div className="
              bg-white/[0.03]
              border border-white/5
              rounded-2xl
              p-5
            ">

              <p className="
                text-emerald-400
                font-semibold
                mb-3
              ">

                Recomendação

              </p>

              <p className="
                text-slate-300
                text-sm
                leading-relaxed
              ">

                {recomendacao || "—"}

              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}