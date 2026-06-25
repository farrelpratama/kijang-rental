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
    <section   
    style={{
    backgroundColor: "#ffffff99",
  }}
  className="py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center"
          >
            <h3 className="text-3xl font-black text-[#031636]">
              {stat.value}
            </h3>

            <p className="mt-2 text-[#031636]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}