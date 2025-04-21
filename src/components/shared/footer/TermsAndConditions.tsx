const TermsAndConditions = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center p-6">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tighter leading-16 lg:leading-20 text-white sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[80vw]">
          Términos y Condiciones
        </h1>

        <span className="text-sm font-light">
          Última actualización: 21/4/2025
        </span>
      </div>

      <p className="font-medium">
        Cortate Bien se compromete a proteger la privacidad de sus usuarios.
        Esta política describe cómo recopilamos, usamos y protegemos la
        información que nos proporcionas al usar Cortate Bien.
      </p>

      <ol className="flex flex-col gap-3 ">
        <li className="first-letter:font-bold">
          1. Uso del servicio Cortate Bien está diseñado para gestionar turnos.
          No debes usar nuestra aplicación para actividades ilegales o no
          autorizadas.
        </li>

        <li className="first-letter:font-bold">
          2. Cuentas de usuario Es tu responsabilidad mantener la seguridad de
          tu cuenta. Proporciona información precisa y actualizada al
          registrarte.
        </li>

        <li className="first-letter:font-bold">
          3. Propiedad intelectual Todos los derechos de autor, marcas
          registradas y contenido pertenecen a Cortate Bien. No puedes copiar,
          modificar ni distribuir nuestro contenido sin permiso.
        </li>

        <li className="first-letter:font-bold">
          4. Limitaciones de responsabilidad Cortate Bien no será responsable de
          daños indirectos, pérdida de datos o cualquier inconveniente derivado
          del uso de la aplicación.
        </li>

        <li className="first-letter:font-bold">
          5. Terminación del servicio Nos reservamos el derecho de suspender o
          eliminar tu cuenta si violas estos términos.
        </li>

        <li className="first-letter:font-bold">
          6. Cambios en los términos Podemos modificar estos términos en
          cualquier momento. Te notificaremos sobre cambios significativos. Al
          usar Cortate Bien, aceptas cumplir con estos términos. Si tienes
          preguntas, contáctanos en cortatebienapp@gmail.com.
        </li>
      </ol>
    </div>
  );
};
export default TermsAndConditions;
