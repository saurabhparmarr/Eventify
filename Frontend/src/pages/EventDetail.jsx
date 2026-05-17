import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
  FaArrowLeft,
  FaShieldAlt,
  FaTicketAlt,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm booking.",
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking requested. Awaiting admin confirmation.");
        setShowOTP(false);
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-[620px] animate-pulse rounded-lg bg-white/70"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-xl font-bold text-red-600">
        {error || "Event not found"}
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const seatPercent = event.totalSeats
    ? (event.availableSeats / event.totalSeats) * 100
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-x-1 hover:text-teal-700"
      >
        <FaArrowLeft /> Back to events
      </Link>

      <section className="overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-900/20">
        <div className="relative min-h-[460px]">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-teal-700 to-slate-950 text-5xl font-black uppercase tracking-[0.2em] text-white/40">
              {event.category}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
            <div className="mb-4 inline-flex rounded-full bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-950">
              {event.category}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              {event.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <FaMapMarkerAlt /> {event.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <FaTicketAlt />{" "}
                {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-lg border border-white/80 bg-white/80 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-teal-700">
            About this event
          </p>
          <p className="mt-4 text-lg leading-9 text-slate-700">
            {event.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <FaMoneyBillWave />,
                label: "Price",
                value:
                  event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`,
              },
              {
                icon: <FaChair />,
                label: "Seats left",
                value: `${event.availableSeats}/${event.totalSeats}`,
              },
              {
                icon: <FaShieldAlt />,
                label: "Verification",
                value: "OTP secured",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-[#f7f2ea] p-5">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-amber-300">
                  {item.icon}
                </div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-white/80 bg-white p-6 shadow-xl shadow-amber-950/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Booking
              </p>
              <h2 className="text-2xl font-black text-slate-950">
                Reserve a seat
              </h2>
            </div>
            <div className="rounded-lg bg-teal-100 px-3 py-2 text-sm font-black text-teal-800">
              {isSoldOut ? "Sold out" : "Open"}
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-[#f7f2ea] p-5">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              <span>Availability</span>
              <span>{Math.round(seatPercent)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-amber-400"
                style={{ width: `${seatPercent}%` }}
              ></div>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-600">
              {event.availableSeats} of {event.totalSeats} seats remaining
            </p>
          </div>

          {showOTP && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Enter OTP to confirm
              </label>
              <input
                type="text"
                required
                placeholder="6-digit code"
                className="h-14 w-full rounded-lg border border-slate-200 bg-[#f7f2ea] px-4 text-center text-lg font-black tracking-[0.3em] text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
              />
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
            className={`w-full rounded-lg px-6 py-4 text-lg font-black shadow-lg transition ${
              isSoldOut || (successMsg && !showOTP)
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "bg-slate-950 text-white shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-teal-700"
            }`}
          >
            {bookingLoading
              ? "Processing..."
              : showOTP
                ? "Verify OTP & Confirm"
                : successMsg && !showOTP
                  ? "Request Sent"
                  : isSoldOut
                    ? "Sold Out"
                    : "Confirm Registration"}
          </button>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-center font-bold text-red-600">
              {error}
            </p>
          )}
          {successMsg && (
            <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-center font-bold text-emerald-700">
              {successMsg}
            </p>
          )}
        </aside>
      </section>
    </div>
  );
};

export default EventDetail;
