import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTicketAlt } from "react-icons/fa";
import { FiArrowUpRight, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-[#fffaf1]/85 shadow-sm shadow-amber-950/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950"
          >
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-amber-300 shadow-lg shadow-slate-900/20 transition group-hover:-rotate-6">
              <FaTicketAlt />
            </span>
            Eventify
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950"
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700"
                >
                  Sign Up <FiArrowUpRight />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
