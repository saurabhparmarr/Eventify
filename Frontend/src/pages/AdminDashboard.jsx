/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheck,
  FaPlus,
  FaRupeeSign,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

const inputClass =
  "h-13 rounded-lg border border-slate-200 bg-[#f7f2ea] px-4 font-semibold outline-none transition focus:border-teal-500 focus:bg-white";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    availableSeats: "",
    image: "",
  });

  async function fetchData() {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", {
        ...formData,
        availableSeats: formData.totalSeats,
      });

      setShowEventForm(false);

      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        availableSeats: "",
        image: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchData();
      } catch {
        alert("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user booking request?")) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xl font-black">
        Loading admin panel...
      </div>
    );

  const revenue = bookings.reduce(
    (sum, b) =>
      b.paymentStatus === "paid" && b.status === "confirmed"
        ? sum + (b.amount || 0)
        : sum,
    0,
  );
  const paidClients = new Set(
    bookings
      .filter((b) => b.paymentStatus === "paid" && b.status === "confirmed")
      .map((b) => b.userId?._id),
  ).size;
  const pendingRequests = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-lg bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
              Control room
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              Create events, review requests, and keep capacity moving without
              losing context.
            </p>
          </div>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 py-4 font-black text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white"
          >
            <FaPlus /> {showEventForm ? "Close Form" : "Create Event"}
          </button>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "Total Revenue",
            value: `₹${revenue}`,
            icon: <FaRupeeSign />,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Paid Clients",
            value: paidClients,
            icon: <FaUsers />,
            color: "bg-teal-100 text-teal-700",
          },
          {
            label: "Pending Requests",
            value: pendingRequests,
            icon: <FaCalendarAlt />,
            color: "bg-amber-100 text-amber-800",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-white/80 bg-white/85 p-6 shadow-sm"
          >
            <div
              className={`mb-5 grid h-12 w-12 place-items-center rounded-lg text-xl ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {showEventForm && (
        <section className="mb-8 rounded-lg border border-white/80 bg-white p-6 shadow-xl shadow-amber-950/10 sm:p-8">
          <h2 className="mb-6 text-2xl font-black text-slate-950">
            Create New Event
          </h2>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <input
              required
              type="text"
              placeholder="Event Title"
              className={inputClass}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category"
              className={inputClass}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              className={inputClass}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className={inputClass}
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Total Seats"
              className={inputClass}
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Ticket Price (0 for free)"
              className={inputClass}
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image URL"
              className={`${inputClass} md:col-span-2`}
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
            <textarea
              required
              placeholder="Event Description"
              className="min-h-32 rounded-lg border border-slate-200 bg-[#f7f2ea] px-4 py-3 font-semibold outline-none transition focus:border-teal-500 focus:bg-white md:col-span-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-950 py-4 font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700 md:col-span-2"
            >
              Publish Event
            </button>
          </form>
        </section>
      )}

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">All Events</h2>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700">
              {events.length}
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-sm">
            <ul className="quiet-scrollbar max-h-[640px] divide-y divide-slate-100 overflow-y-auto">
              {events.length === 0 ? (
                <li className="p-6 text-center font-bold text-slate-500">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#fbf7ef] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="font-black leading-tight text-slate-950">
                        {event.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <FaTrash /> Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">
              Booking Requests
            </h2>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">
              {bookings.length}
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-sm">
            <ul className="quiet-scrollbar max-h-[640px] divide-y divide-slate-100 overflow-y-auto">
              {bookings.length === 0 ? (
                <li className="p-6 text-center font-bold text-slate-500">
                  No bookings yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className="p-5 transition hover:bg-[#fbf7ef]"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h4 className="text-lg font-black leading-tight text-slate-950">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}
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
                    <div className="rounded-lg bg-[#f7f2ea] p-4 text-sm font-semibold text-slate-600">
                      <p>
                        <span className="font-black text-slate-950">User:</span>{" "}
                        {booking.userId?.name || "Unknown User"}
                      </p>
                      <p className="mt-1">
                        <span className="font-black text-slate-950">
                          Amount:
                        </span>{" "}
                        {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                      </p>
                      <p className="mt-1">
                        <span className="font-black text-slate-950">
                          Requested:
                        </span>{" "}
                        {new Date(booking.bookedAt).toLocaleString()}
                      </p>
                    </div>

                    {booking.status === "pending" && (
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs font-black text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                        >
                          <FaCheck /> Paid
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "unpaid")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                          <FaCheck /> Confirm Without Payment
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
