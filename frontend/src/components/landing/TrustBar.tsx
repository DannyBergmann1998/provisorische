import { Shield, Zap, DollarSign, Users } from "lucide-react";

export function TrustBar() {
  const trustItems = [
    {
      icon: Shield,
      label: "6 Monate Garantie",
      text: "Auf alle Reparaturen",
    },
    {
      icon: Zap,
      label: "Schnelle Reparatur",
      text: "Oft am selben Tag",
    },
    {
      icon: DollarSign,
      label: "Faire Preise",
      text: "Transparent & ehrlich",
    },
    {
      icon: Users,
      label: "Persönlicher Service",
      text: "Kein Call-Center",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-[#151515] border-b border-gray-200 dark:border-[#333333] transition-colors duration-300 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center">
                <Icon
                  size={28}
                  className="text-primary-600 dark:text-primary-400 mb-3 flex-shrink-0"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
