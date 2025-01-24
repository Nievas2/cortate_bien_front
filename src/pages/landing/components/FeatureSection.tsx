import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
const FeatureSection = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full bg-linear-to-b from-gray-main/40 to-gray-main py-10 relative">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-secondary/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-secondary/40 rounded-full blur-3xl" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.h2
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tighter text-white sm:text-5xl"
          >
            Características principales
          </motion.h2>
          <motion.p
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            Todo lo que necesitas para gestionar tu barbería de manera
            eficiente.
          </motion.p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[#007FFF] p-6 min-h-[200px]"
        >
          <Icon icon="ri:calendar-line" width="24" height="24" />
          <h3 className="text-xl font-bold text-white">Gestión de turnos</h3>
          <p className="text-gray-400">
            Sistema intuitivo para administrar reservas y turnos de manera
            eficiente
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[#007FFF] p-6 min-h-[200px]"
        >
          <Icon icon="mdi:users" width="24" height="24" />
          <h3 className="text-xl font-bold text-white">Gestión de clientes</h3>
          <p className="text-gray-400">
            Mantén un registro detallado de las preferencias de tus clientes
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[#007FFF] p-6 min-h-[200px]"
        >
          <Icon icon="ri:time-line" width="24" height="24" />{" "}
          <h3 className="text-xl font-bold text-white">Ahorro de Tiempo</h3>
          <p className="text-gray-400">
            Automatiza tu agenda y reduce las tareas administrativas
          </p>
        </motion.div>
      </div>
    </section>
  )
}
export default FeatureSection
