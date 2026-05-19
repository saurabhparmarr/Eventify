import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaTicketAlt,
  FaUserAlt,
} from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
        setError("");
      } else {
        await verifyOTP(email.trim().toLowerCase(), otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section className="mx-auto w-full max-w-md rounded-lg border border-white/80 bg-white/85 p-6 shadow-2xl shadow-amber-950/10 backdrop-blur sm:p-8">
        <div className="mb-8">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-slate-950 text-xl text-amber-300">
            <FaTicketAlt />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-teal-700">
            {showOTP ? "Verify email" : "Create access"}
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {showOTP ? "Enter your OTP" : "Join Eventify"}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            {showOTP
              ? "We sent a code to your email so your account can be activated."
              : "Save seats, track requests, and manage event plans in one place."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!showOTP ? (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  Full Name
                </span>
                <span className="relative block">
                  <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="h-14 w-full rounded-lg border border-slate-200 bg-[#f7f2ea] pl-12 pr-4 font-semibold outline-none transition focus:border-teal-500 focus:bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  Email Address
                </span>
                <span className="relative block">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="h-14 w-full rounded-lg border border-slate-200 bg-[#f7f2ea] pl-12 pr-4 font-semibold outline-none transition focus:border-teal-500 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  Password
                </span>
                <span className="relative block">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    className="h-14 w-full rounded-lg border border-slate-200 bg-[#f7f2ea] pl-12 pr-4 font-semibold outline-none transition focus:border-teal-500 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </span>
              </label>
            </>
          ) : (
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                Verification Code
              </span>
              <span className="relative block">
                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="6-digit code"
                  className="h-14 w-full rounded-lg border border-slate-200 bg-[#f7f2ea] pl-12 pr-4 text-center text-lg font-black tracking-[0.28em] outline-none transition placeholder:tracking-normal focus:border-teal-500 focus:bg-white"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength="6"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-lg bg-slate-950 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-wait disabled:bg-slate-400"
          >
            {loading
              ? "Processing..."
              : showOTP
                ? "Verify & Complete"
                : "Create Account"}
          </button>
        </form>

        {!showOTP && (
          <p className="mt-8 text-center font-semibold text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-black text-teal-700 hover:text-slate-950"
            >
              Sign in
            </Link>
          </p>
        )}
      </section>

      <section className="hidden overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-900/20 lg:block">
        <div className="relative min-h-[680px]">
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1800&auto=format&fit=crop"
            alt="Event audience under stage lights"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>
          <div className="absolute bottom-0 p-10 text-white">
            <div className="mb-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-slate-950">
              Member access
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Create your personal event desk.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
              Register once, then keep every request and confirmation neatly
              organized.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
