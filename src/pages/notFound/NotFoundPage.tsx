import NotFound from "@/components/shared/NotFound"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  document.title = "Cortate bien | Not Found"
  return (
    <main className="flex items-center justify-center w-full min-h-screen">
      <NotFound>
        <Link className="flex items-center justify-center w-full" to="/">
          <Button variant="simple" className="flex gap-2">
            <Icon icon="carbon:home" />
            Ir al inicio
          </Button>
        </Link>
      </NotFound>
    </main>
  )
}
export default NotFoundPage
