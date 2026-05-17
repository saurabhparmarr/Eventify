/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";

const badgeClass = {
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-800",
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xl font-black">
        Loading dashboard...
      </div>
    );

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;
  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-900/20">
        <div className="relative grid gap-8 p-6 text-white sm:p-8 lg:grid-cols-[1fr_420px] lg:p-10">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,#fbbf24,transparent_28%),radial-gradient(circle_at_80%_0%,#14b8a6,transparent_24%)]"></div>
          <div className="relative">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-lg bg-white text-3xl font-black uppercase text-slate-950 shadow-xl">
              {user?.name?.charAt(0)}
            </div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
              User Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Welcome, {user?.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
              Track every request, confirmation, and event detail from one
              focused place.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/12 p-5 backdrop-blur">
              <p className="text-sm font-bold text-white/60">Total bookings</p>
              <p className="mt-2 text-4xl font-black">{bookings.length}</p>
            </div>
            <div className="rounded-lg bg-white/12 p-5 backdrop-blur">
              <p className="text-sm font-bold text-white/60">Confirmed</p>
              <p className="mt-2 text-4xl font-black">{confirmedCount}</p>
            </div>
            <div className="col-span-2 rounded-lg bg-amber-300 p-5 text-slate-950">
              <p className="text-sm font-black uppercase tracking-[0.16em]">
                Pending requests
              </p>
              <p className="mt-2 text-4xl font-black">{pendingCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-3xl font-black text-slate-950">
          <FaTicketAlt className="text-teal-700" /> My booking requests
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white/75 p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-lg bg-[#f7f2ea]">
            <FaTicketAlt className="text-3xl text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-950">
            No bookings yet
          </h3>
          <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
            Browse events and reserve your first seat. Your requests will appear
            here.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-lg bg-slate-950 px-7 py-4 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/10"
            >
              <div className="p-6">
                {booking.eventId ? (
                  <>
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-black leading-tight text-slate-950">
                        {booking.eventId.title}
                      </h3>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${badgeClass[booking.status] || badgeClass.pending}`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${booking.paymentStatus === "paid" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"}`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm font-semibold text-slate-600">
                      <p className="flex items-center gap-3">
                        <FaCalendarAlt className="text-amber-600" />{" "}
                        {new Date(booking.eventId.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-teal-700" />{" "}
                        {booking.eventId.location}
                      </p>
                      <p className="rounded-lg bg-[#f7f2ea] px-4 py-3 font-black text-slate-950">
                        Amount:{" "}
                        {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="font-bold italic text-red-500">
                    Event details unavailable
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-[#fbf7ef] p-4">
                {booking.eventId && booking.status !== "cancelled" ? (
                  <>
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="font-black text-slate-950 hover:text-teal-700"
                    >
                      View Event
                    </Link>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black text-red-600 transition hover:bg-red-50"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center text-sm font-bold text-slate-500">
                    Booking Cancelled
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
