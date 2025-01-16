import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"

const AddBarberShop = () => {
  return (
    <section className="flex items-center justify-center relative group">
        <div className="absolute inset-0 opacity-50 size-48 bg-transparent blur-3xl rounded-xl group-hover:bg-blue-main/40" />
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center rounded-xl size-48 border border-blue-main group-hover:bg-blue-main/80 group-hover:text-white"
      >
        <Icon icon="tabler:plus" height={24} width={24} />
        Agregar una barberia
      </Button>
    </section>
  )
}
export default AddBarberShop
