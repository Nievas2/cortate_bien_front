import { Button } from "@/components/ui/button";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getBarberById } from "@/services/BarberService";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Barber } from "@/interfaces/Barber";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [barbery, setBarbery] = useState<Barber | undefined>();
  const [open, setOpen] = useState(true);
  const { search } = useLocation();
  const id = search.split("=")[1];

  const { data, isSuccess } = useQuery({
    queryKey: ["barber", id],
    queryFn: () => getBarberById(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  useEffect(() => {
    setBarbery(data);
  }, [isSuccess]);

  return (
    <div className="flex relative w-full">
      <SideBar open={open} setOpen={setOpen} barber={barbery} />

      <div className="relative">
        <Button
          className={`z-40 transition-transform duration-300 ${
            open
              ? "rotate-180 translate-x-2  translate-y-2 fixed sm:sticky top-20"
              : "rotate-0 translate-y-2 translate-x-2 sm:translate-x-2 fixed sm:sticky top-20"
          }`}
          variant="secondary"
          size="rounded"
          onClick={() => setOpen(!open)}
        >
          <Icon icon="tabler:chevron-right" height={20} width={20} />
        </Button>
      </div>

      <section className="flex flex-col gap-2 items-center justify-center min-h-screen w-full p-2">
        {children}
      </section>
    </div>
  );
};

export default Layout;
