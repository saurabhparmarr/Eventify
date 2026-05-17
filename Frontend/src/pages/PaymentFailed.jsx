import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-5xl place-items-center px-4 py-10">
      <div className="w-full max-w-lg rounded-lg border border-white/80 bg-white/85 p-8 text-center shadow-2xl shadow-amber-950/10 backdrop-blur">
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-lg bg-red-100 text-5xl text-red-600">
          <FaTimesCircle />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">
          Action needed
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Booking Failed
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          We could not process your payment. Please check your details and try
          again.
        </p>
        <div className="mt-8 space-y-3">
          <Link
            to="/"
            className="block w-full rounded-lg bg-slate-950 py-4 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-red-600"
          >
            Return to Events
          </Link>
          <Link
            to="/dashboard"
            className="block w-full rounded-lg bg-[#f7f2ea] py-4 font-black text-slate-700 transition hover:bg-amber-100"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
