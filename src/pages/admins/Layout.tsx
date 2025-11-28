import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import SideBarAdmins from "./components/SideBarAdmins";
import { Background } from "@/components/ui/background";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);

  return (
    <Background>
      <div className="flex relative w-full">
        <SideBarAdmins open={open} onClose={() => setOpen(false)} />

        <div className="relative">
          <Button
            className={`z-[202] transition-all duration-300 fixed top-24 left-4 ${
              open ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            variant="secondary"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Icon icon="tabler:menu-2" height={20} width={20} />
          </Button>
        </div>

        <section className="flex items-center justify-center w-full py-4">
          {children}
        </section>
      </div>
    </Background>
  );
};
export default Layout;
