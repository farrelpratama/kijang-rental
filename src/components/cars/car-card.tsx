interface Props {
  name: string;
  category: string;
  seats: number;
  transmission: string;
  fuel: string;
  price: number;
  available: boolean;
  image: string;
}

export default function CarCard(props: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-56 bg-slate-50">
        <img
          src={props.image}
          alt={props.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-medium ${
            props.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {props.available
            ? "Available"
            : "Rented"}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg">
          {props.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {props.category}
        </p>

        <div className="my-5 flex justify-between border-y py-4 text-sm text-slate-500">
          <span>{props.transmission}</span>
          <span>{props.seats} Seats</span>
          <span>{props.fuel}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">
              Start from
            </p>

            <p className="text-2xl font-bold text-[#031636]">
              Rp{" "}
              {(
                props.price / 1000
              ).toLocaleString("id-ID")}
              k
              <span className="text-sm text-slate-500">
                /day
              </span>
            </p>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#031636] text-white">
            →
          </button>
        </div>
      </div>
    </div>
  );
}