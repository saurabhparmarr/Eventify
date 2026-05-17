import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f2ea] text-slate-950 flex flex-col">
      <Navbar />
      <main className="relative flex-grow">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.13),transparent_24%),linear-gradient(180deg,#fffaf1_0%,#f7f2ea_46%,#eef7f4_100%)]"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route
            path="*"
            element={
              <h1 className="text-3xl font-bold text-center mt-20">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
