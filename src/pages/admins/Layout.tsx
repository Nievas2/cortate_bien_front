import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import SideBarAdmins from "./components/SideBarAdmins";
import { Background } from "@/components/ui/background";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Background>
      <div className="flex relative w-full">
        <SideBarAdmins open={open} onClose={() => setOpen(false)} />

        <div className="relative">
          <Button
            className={`z-[202] transition-all duration-300 fixed top-[50%] left-2 ${
              open ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            variant="secondary"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Icon icon="maki:arrow" height={15} width={15} />
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
