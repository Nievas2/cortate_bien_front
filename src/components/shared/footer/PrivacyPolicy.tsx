const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-6">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tighter leading-16 lg:leading-20 text-white sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[80vw]">
          Política de Privacidad
        </h1>

        <span className="text-sm font-light">
          Última actualización: 10/2/2025
        </span>
      </div>

      <p className="font-medium">
        Cortate Bien se compromete a proteger la privacidad de sus usuarios.
        Esta política describe cómo recopilamos, usamos y protegemos la
        información que nos proporcionas al usar Cortate Bien.
      </p>

      <ol className="flex flex-col gap-3 ">
        <li className="first-letter:font-bold">
          1. Información que recopilamos Información personal: Nombre, correo
          electrónico, número de teléfono, etc. Información técnica: Dirección
          IP, tipo de navegador, sistema operativo, cookies, etc. Datos de uso:
          Cómo interactúas con nuestra aplicación, páginas visitadas, duración
          de las sesiones, etc.
        </li>

        <li className="first-letter:font-bold">
          2. Cómo usamos la información Para personalizar tu experiencia en
          Cortate Bien. Para mejorar nuestros servicios y funcionalidades. Para
          enviarte notificaciones importantes o información promocional (si lo
          aceptas).
        </li>

        <li className="first-letter:font-bold">
          3. Cómo protegemos tu información Usamos medidas de seguridad
          estándar, como cifrado y firewalls, para proteger tus datos.
        </li>

        <li className="first-letter:font-bold">
          4. Compartir información con terceros No compartiremos tu información
          con terceros, excepto en los siguientes casos: Cumplimiento de
          requisitos legales. Proveedores de servicios necesarios para operar la
          aplicación.
        </li>

        <li className="first-letter:font-bold">
          5. Tus derechos Puedes acceder, rectificar o eliminar tus datos
          personales. Para ejercer estos derechos, contáctanos en
          angelgabrielnievas@gmail.com.
        </li>

        <li className="first-letter:font-bold">
          6. Cambios en esta política Nos reservamos el derecho de modificar
          esta política en cualquier momento. Te notificaremos de cambios
          significativos. Si tienes preguntas, no dudes en escribirnos a
          angelgabrielnievas@gmail.com.
        </li>
      </ol>
    </div>
  );
};
export default PrivacyPolicy;
