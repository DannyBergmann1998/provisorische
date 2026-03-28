import { Monitor, Battery, Gauge, Droplets } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: Monitor,
      title: "Display kaputt",
      text: "Gesprungenes Glas oder schwarzer Bildschirm – wir tauschen es schnell und günstig.",
    },
    {
      icon: Battery,
      title: "Akku schwach",
      text: "Hält der Akku nicht mehr durch? Oft schon ab 29 € behoben.",
    },
    {
      icon: Gauge,
      title: "Gerät sehr langsam",
      text: "Viren, voller Speicher oder veraltetes System – wir bringen es wieder auf Tempo.",
    },
    {
      icon: Droplets,
      title: "Wasserschaden",
      text: "Nicht in Panik ausbrechen – ausschalten, zu uns bringen. Professionelle Behandlung.",
    },
  ];

  return (
    <section className="section bg-white dark:bg-[#0A0A0A]">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Erkennst du dich wieder?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Diese Probleme lösen wir täglich – schnell und zuverlässig.
            </p>
          </div>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem) => {
              const Icon = problem.icon;
              return (
                <div
                  key={problem.title}
                  className="card-hover p-6 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {problem.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
