import { LeccionLayout } from "@/components/LeccionLayout";

export default function FiatASolana() {
  return (
    <LeccionLayout
      numero="01"
      titulo="De tu banco a Solana"
      duracion="10 minutos"
      nivel="Principiante absoluto"
      necesitas="Cuenta bancaria + DNI"
      siguiente={{ slug: "phantom", titulo: "Instalar Phantom y mover tu SOL" }}
    >
      <h2>¿Qué vas a aprender?</h2>
      <p>
        Cómo convertir dinero de tu banco en SOL (la moneda de la red Solana). Este es el primer paso para entrar a Witleik o a cualquier proyecto en Solana.
      </p>
      <p>
        Usaremos <strong>Coinbase</strong> porque acepta tarjetas y transferencias en casi todos los países, tiene buena reputación y la interfaz es sencilla.
      </p>

      <h2>Paso 1 — Crear cuenta en Coinbase</h2>
      <ol>
        <li>Entra a <strong>coinbase.com</strong> o descarga la app oficial desde la App Store o Google Play</li>
        <li>Pulsa "Empezar" y registra tu email + contraseña</li>
        <li>Confirma tu email desde el enlace que te llegará al correo</li>
      </ol>
      <blockquote>
        ⚠️ <strong>IMPORTANTE:</strong> usa una contraseña fuerte y única. Esta cuenta va a tener tu dinero.
      </blockquote>

      <h2>Paso 2 — Verificar tu identidad</h2>
      <p>Coinbase está regulado, así que necesita confirmar quién eres. Es un trámite de 5-10 minutos:</p>
      <ol>
        <li>Pulsa "Verificar identidad"</li>
        <li>Sube una foto de tu DNI, pasaporte o licencia de conducir</li>
        <li>Hazte un selfie cuando te lo pida</li>
        <li>Espera la confirmación (suele ser inmediata, máximo 24h)</li>
      </ol>

      <h2>Paso 3 — Añadir método de pago</h2>
      <p>Tienes dos opciones:</p>
      <p>
        <strong>Opción A — Tarjeta de débito/crédito</strong> (más rápido, comisión ~3-4%)<br />
        Settings → Payment methods → Add payment method → Tarjeta de débito
      </p>
      <p>
        <strong>Opción B — Transferencia bancaria</strong> (más lento 1-3 días, comisión casi cero)<br />
        Settings → Payment methods → Add payment method → Cuenta bancaria
      </p>
      <p>💡 Para empezar y probar, usa la tarjeta. Para cantidades grandes, mejor transferencia.</p>

      <h2>Paso 4 — Comprar SOL</h2>
      <ol>
        <li>En la pantalla principal busca "Comprar" o el botón +</li>
        <li>Busca "Solana" o "SOL"</li>
        <li>Introduce la cantidad en tu moneda local (ej: $50 USD, €50)</li>
        <li>Coinbase te mostrará cuánto SOL recibirás</li>
        <li>Pulsa "Vista previa de la compra" → revisa todo → "Comprar ahora"</li>
      </ol>
      <p>✅ En segundos tu SOL aparecerá en tu cuenta de Coinbase.</p>

      <h2>Lo que NO debes hacer</h2>
      <ul>
        <li><strong>No dejes el SOL en Coinbase para siempre.</strong> Coinbase es un exchange, no una wallet tuya. Si quieres usar tu SOL en Witleik o DeFi, necesitas pasarlo a tu propia wallet (la siguiente lección)</li>
        <li><strong>No compres más de lo que puedas permitirte perder.</strong> Cripto sube y baja fuerte. Empieza con poco.</li>
        <li><strong>No compartas tu contraseña con nadie.</strong> Witleik nunca te pedirá tu login.</li>
      </ul>

      <h2>¿Listo para el siguiente paso?</h2>
      <p>
        Ya tienes SOL en Coinbase. Ahora toca crear <strong>tu propia wallet en Phantom</strong> y mover ese SOL allí. Sin eso no puedes invertir en Witleik ni en nada de DeFi.
      </p>
    </LeccionLayout>
  );
}
