import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      setLoading(true);

      const { data } = await api.get(`/events?search=${search}`);

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const heroEvent = useMemo(() => events[0], [events]);

  const categories = useMemo(
    () =>
      [...new Set(events.map((event) => event.category).filter(Boolean))].slice(
        0,
        5,
      ),
    [events],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <section className="grid min-h-[78vh] items-center gap-10 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
        {/* LEFT SIDE */}
        <div>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            Discover trending events around you
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Discover Amazing
            <br />
            Events Near You.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Book concerts, tech fests, workshops, college events, and
            unforgettable experiences with a fast and seamless booking system.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchEvents();
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label className="relative flex flex-1 items-center">
                <FaSearch className="absolute left-5 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 w-full rounded-xl bg-slate-100 pl-12 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 font-black text-white transition hover:bg-teal-700"
              >
                Explore
                <FaArrowRight />
              </button>
            </form>
          </div>

          {/* CATEGORIES */}
          <div className="mt-7 flex flex-wrap gap-3">
            {(categories.length > 0
              ? categories
              : ["Music", "Tech", "Workshop"]
            ).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSearch(category);

                  setTimeout(() => {
                    fetchEvents();
                  }, 100);
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-500 hover:text-teal-700"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            {/* IMAGE */}
            <div className="relative min-h-[540px]">
              <img
                src={
                  heroEvent?.image ||
                  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop"
                }
                alt={heroEvent?.title || "Event"}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                  Featured Event
                </div>

                <h2 className="max-w-xl text-4xl font-black leading-tight text-white">
                  {heroEvent?.title || "Startup Networking Summit 2026"}
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md">
                    <FaCalendarAlt className="mb-2 text-amber-300" />

                    <p className="text-sm font-bold">
                      {heroEvent ? formatDate(heroEvent.date) : "This Week"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md">
                    <FaMapMarkerAlt className="mb-2 text-teal-300" />

                    <p className="text-sm font-bold">
                      {heroEvent?.location || "Your City"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-xl">
            <p className="text-sm font-bold text-slate-500">Live Seats</p>

            <h3 className="text-3xl font-black text-slate-950">
              {heroEvent?.availableSeats ?? 128}
            </h3>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 gap-5 py-10 md:grid-cols-3">
        {[
          {
            icon: <FaRegClock />,
            title: "Instant Booking",
            text: "Book your tickets quickly with a smooth checkout experience.",
          },
          {
            icon: <FaTicketAlt />,
            title: "Live Availability",
            text: "Check real-time seats, pricing, and event information instantly.",
          },
          {
            icon: <FaShieldAlt />,
            title: "Secure Access",
            text: "OTP-based secure booking system for trusted event management.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-xl text-white">
              {item.icon}
            </div>

            <h3 className="text-2xl font-black text-slate-950">{item.title}</h3>

            <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      {/* EVENTS */}
      <section className="py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-700">
              Upcoming Events
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Events People Love
            </h2>
          </div>

          <div className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-700 shadow">
            {events.length} Results
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-3xl bg-slate-200"
              ></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FaSearch className="mx-auto mb-5 text-4xl text-slate-300" />

            <h3 className="text-2xl font-black text-slate-950">
              No matching events
            </h3>

            <p className="mt-3 text-slate-600">Try another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const seatPercent = event.totalSeats
                ? (event.availableSeats / event.totalSeats) * 100
                : 0;

              return (
                <Link
                  to={`/events/${event._id}`}
                  key={event._id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-slate-800">
                      {event.category}
                    </div>

                    <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `₹${event.ticketPrice}`}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-2 text-2xl font-black text-slate-950">
                      {event.title}
                    </h3>

                    <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt />
                        {formatDate(event.date)}
                      </div>

                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt />
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <FaUsers />
                          Seats
                        </span>

                        <span>
                          {event.availableSeats}/{event.totalSeats}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{
                            width: `${seatPercent}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-950 transition group-hover:bg-slate-950 group-hover:text-white">
                      View Details
                      <FaArrowRight />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-200 py-10 text-center">
        <div className="flex items-center justify-center gap-3 text-3xl font-black text-slate-950">
          <FaTicketAlt className="text-teal-700" />
          Eventify
        </div>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Discover and book the best events happening around you.
        </p>
      </footer>
    </div>
  );
};

export default Home;
