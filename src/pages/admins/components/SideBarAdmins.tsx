import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useLocation } from "react-router-dom";

const SideBarAdmins = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { pathname, search } = useLocation();
  const { logOut } = useLogout();

  const navigation = [
    {
      name: "Dashboard",
      icon: "tabler:home",
      href: `/admins/dashboard`,
    },
    {
      name: "Barberias disabled",
      icon: "fe:disabled",
      href: `/admins/dashboard/barbers/disabled`,
    },
    {
      name: "Planes",
      icon: "streamline:subscription-cashflow",
      href: `/admins/dashboard/plans`,
    },
    {
      name: "Firebase",
      icon: "tabler:brand-firefox",
      href: `/admins/dashboard/firebase`,
    },
  ];

  return (
    <aside
      className={`h-screen transition-all duration-300 fixed top-0 z-[201] border-r border-white/10 bg-slate-950/50 backdrop-blur-xl ${
        open ? "w-[280px]" : "w-0 -translate-x-full overflow-hidden"
      }`}
    >
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20">
              <Icon
                className="text-white"
                icon="wpf:administrator"
                width="20"
                height="20"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg leading-none tracking-tight">
                Admin Panel
              </span>
              <span className="text-xs text-blue-400 font-medium mt-1">
                Cortate Bien
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <Icon icon="tabler:x" width={20} height={20} />
          </Button>
        </div>
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Menu Principal
          </p>
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname + search === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600/10 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    icon={item.icon}
                    height={20}
                    width={20}
                    className={`transition-colors duration-200 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"}`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <Button
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
            variant="ghost"
            onClick={logOut}
          >
            <Icon icon="tabler:logout" width={20} height={20} />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default SideBarAdmins;
