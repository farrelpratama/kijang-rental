export default function StatsSection() {
  const stats = [
    {
      label: "Tahun Pengalaman",
      value: "5+",
    },
    {
      label: "Armada",
      value: "100+",
    },
    {
      label: "Pelanggan",
      value: "10.000+",
    },
    {
      label: "Support",
      value: "24/7",
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-6 text-center"
          >
            <h3 className="text-3xl font-bold text-primary">
              {stat.value}
            </h3>

            <p className="mt-2 text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}