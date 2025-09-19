import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Política de Privacidad">
      <div className="space-y-6">
        <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>
          En Tobias MakeUp, tu privacidad es de suma importancia para nosotros. Esta Política de Privacidad describe cómo recopilamos, usamos, protegemos y gestionamos tu información personal.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">1. Información que Recopilamos</h2>
          <p>
            Podemos recopilar información personal que tú nos proporcionas directamente, tal como:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Información de Contacto:</strong> Nombre, número de teléfono y dirección de correo electrónico cuando nos contactas a través de nuestro formulario o WhatsApp.</li>
            <li><strong>Información para Testimonios:</strong> Nombre y opinión cuando envías un testimonio a través de nuestro formulario.</li>
            <li><strong>Información de Citas:</strong> Detalles relevantes para la prestación de nuestros servicios, como tipo de evento, fecha y posibles alergias o condiciones de la piel.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">2. Cómo Usamos tu Información</h2>
          <p>
            Utilizamos la información recopilada para los siguientes propósitos:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>Para comunicarnos contigo y responder a tus consultas.</li>
            <li>Para agendar y gestionar tus citas de maquillaje.</li>
            <li>Para prestar nuestros servicios de manera segura y personalizada.</li>
            <li>Para publicar testimonios en nuestro sitio web (con tu consentimiento implícito al enviarlo).</li>
            <li>Para mejorar nuestros servicios y la experiencia en nuestro sitio web.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">3. Protección de tu Información</h2>
          <p>
            Implementamos medidas de seguridad para proteger tu información personal. Los datos de la aplicación se almacenan localmente en tu navegador utilizando tecnologías como LocalStorage e IndexedDB, lo que significa que no se transmiten a un servidor central, excepto cuando interactúas con servicios de terceros como WhatsApp.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">4. No Compartimos tu Información</h2>
          <p>
            No vendemos, intercambiamos ni transferimos de ninguna manera tu información personal a terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">5. Tus Derechos</h2>
          <p>
            Tienes derecho a solicitar el acceso, corrección o eliminación de tu información personal que podamos tener. Para ejercer estos derechos, por favor, contáctanos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">6. Cambios a esta Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te recomendamos revisarla periódicamente.
          </p>
        </section>
        
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">7. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, por favor, <a href="/#contacto" className="text-primary underline hover:no-underline">contáctanos</a>.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
