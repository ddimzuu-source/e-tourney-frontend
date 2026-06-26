import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Trophy, Shield, CreditCard,
  Users, Settings, LogOut, Swords
} from "lucide-react";

// Nav items dengan flag adminOnly
const NAV_ITEMS = [
  { path: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard, adminOnly: false },
  { path: "/tournaments", label: "Tournaments", icon: Trophy,          adminOnly: false },
  { path: "/teams",       label: "Teams",       icon: Shield,          adminOnly: false },
  { path: "/payments",    label: "Payments",    icon: CreditCard,      adminOnly: false },
  { path: "/users",       label: "Users",       icon: Users,           adminOnly: true  },
  { path: "/settings",    label: "Settings",    icon: Settings,        adminOnly: true  },
];

const ACTIVE_COLORS = {
  "/dashboard":   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", bar: "bg-emerald-400" },
  "/tournaments": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", bar: "bg-emerald-400" },
  "/teams":       { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    bar: "bg-cyan-400"    },
  "/payments":    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   bar: "bg-amber-400"   },
  "/users":       { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  bar: "bg-violet-400"  },
  "/settings":    { bg: "bg-gray-500/10",    text: "text-gray-400",    border: "border-gray-500/20",    bar: "bg-gray-400"    },
};

export default function Sidebar({ open }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const authUser  = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const isAdmin   = authUser.role === "admin";
  const isActive  = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    navigate("/login");
  };

  return (
    <aside className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0d0d0f] border-r border-white/5 transition-all duration-300 ease-in-out ${open ? "w-64" : "w-0 overflow-hidden md:w-16"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 shrink-0">
          <Swords size={16} className="text-[#0d0d0f]" />
        </div>
        {open && <span className="text-white font-black tracking-wider text-lg whitespace-nowrap">E<span className="text-emerald-400">-</span>TOURNEY</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {/* Role badge */}
        {open && (
          <div className="px-3 pb-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAdmin ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-violet-500/10 text-violet-400 border border-violet-500/20"}`}>
              {isAdmin ? "Administrator" : "Panitia"}
            </span>
          </div>
        )}

        {NAV_ITEMS.map(({ path, label, icon: Icon, adminOnly }) => {
          // Sembunyikan menu adminOnly untuk panitia
          if (adminOnly && !isAdmin) return null;

          const active = isActive(path);
          const colors = ACTIVE_COLORS[path] ?? ACTIVE_COLORS["/dashboard"];

          return (
            <button key={path} onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative overflow-hidden ${active ? `${colors.bg} ${colors.text} border ${colors.border}` : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"}`}>
              {active && <span className={`absolute left-0 top-2 bottom-2 w-0.5 ${colors.bar} rounded-full`} />}
              <Icon size={18} className={`shrink-0 ${active ? colors.text : "group-hover:text-gray-200"}`} />
              {open && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">
            {authUser.name?.slice(0, 2).toUpperCase() ?? "AD"}
          </div>
          {open && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{authUser.name ?? "Admin"}</p>
                <p className={`text-xs truncate capitalize ${isAdmin ? "text-amber-400" : "text-violet-400"}`}>
                  {authUser.role ?? "staff"}
                </p>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-rose-400 transition-colors p-1" title="Logout">
                <LogOut size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
