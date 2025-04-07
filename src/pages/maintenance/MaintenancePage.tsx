const MaintenancePage = () => {
  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="mx-auto w-32 h-32 relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/logo.png" alt="logo" />
           {/*  <div className="w-24 h-24 rounded-full bg-blue-main flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-2xl font-bold">BARBER</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-main">
            Sitio en Mantenimiento
          </h1>
          <p className="text-xl text-zinc-300">
            Estamos mejorando nuestro sitio web para ofrecerte una mejor
            experiencia. Volveremos pronto.
          </p>
        </div>
      </div>
    </div>
  )
}
export default MaintenancePage
