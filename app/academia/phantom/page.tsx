import { LeccionLayout } from "@/components/LeccionLayout";

export default function Phantom() {
  return (
    <LeccionLayout
      numero="02"
      titulo="Instalar Phantom y mover tu SOL"
      duracion="15 minutos"
      nivel="Principiante"
      necesitas="SOL en Coinbase"
      anterior={{ slug: "fiat-a-solana", titulo: "De tu banco a Solana" }}
      siguiente={{ slug: "invertir-en-witleik", titulo: "Cómo invertir en Witleik" }}
    >
      <h2>¿Qué es Phantom y por qué la necesito?</h2>
      <p>Phantom es <strong>tu wallet personal en Solana</strong>. Piénsalo así:</p>
      <ul>
        <li><strong>Coinbase</strong> = el banco. Ellos custodian tu dinero.</li>
        <li><strong>Phantom</strong> = tu cartera física. TÚ tienes la llave.</li>
      </ul>
      <p>Para usar Witleik, DeFi, swaps o cualquier dApp, necesitas Phantom. Coinbase no sirve para eso.</p>

      <h2>Paso 1 — Instalar Phantom</h2>
      <p>Phantom funciona en móvil y en navegador. <strong>Recomendado: instala las dos.</strong></p>
      <p><strong>Móvil (iOS / Android):</strong></p>
      <ol>
        <li>App Store o Google Play → busca "Phantom Wallet"</li>
        <li>Verifica que el creador sea <strong>Phantom Technologies</strong></li>
        <li>Instala</li>
      </ol>
      <p><strong>Desktop (Chrome / Brave / Firefox):</strong></p>
      <ol>
        <li>Entra a <strong>phantom.app</strong> (NUNCA hagas click en un anuncio de Google)</li>
        <li>Descarga la extensión oficial</li>
        <li>Añádela al navegador</li>
      </ol>

      <h2>Paso 2 — Crear tu wallet</h2>
      <p>Abre Phantom y pulsa "Crear nueva wallet". Te pedirá poner una contraseña → ponla fuerte y guárdala donde no se pierda.</p>

      <h2>Paso 3 — Tu frase secreta (LO MÁS IMPORTANTE)</h2>
      <p>Phantom te mostrará <strong>12 palabras</strong> en orden. Esto se llama "seed phrase" o frase semilla.</p>
      <blockquote>
        🚨 <strong>ESTA ES LA REGLA MÁS IMPORTANTE DE TODA CRIPTO.</strong>
      </blockquote>
      <p>✅ Apúntalas en papel, en orden, sin errores</p>
      <p>✅ Guarda el papel en un sitio seguro (caja fuerte, cajón con llave)</p>
      <p>✅ Apunta una copia en otro lugar diferente</p>
      <p>✅ Si quieres extra seguridad, grábalas en metal</p>
      <p>❌ NUNCA las pongas en una nota del móvil, foto, WhatsApp, Google Drive, email</p>
      <p>❌ NUNCA se las des a nadie, ni siquiera a alguien que diga ser de Witleik o Phantom</p>
      <p>❌ NUNCA las escribas en una web</p>
      <blockquote>
        ⚠️ Si alguien tiene tu frase semilla, tiene TODO tu dinero. Para siempre. No hay forma de recuperarlo.
      </blockquote>

      <h2>Paso 4 — Encontrar tu dirección de Phantom</h2>
      <p>Tu wallet tiene una <strong>dirección pública</strong> — es como tu IBAN, pero en Solana. Sirve para que te envíen SOL.</p>
      <ol>
        <li>Abre Phantom</li>
        <li>En la parte superior verás algo como "7gK4...8mZx"</li>
        <li>Pulsa encima → se copia la dirección completa</li>
      </ol>

      <h2>Paso 5 — Mover tu SOL de Coinbase a Phantom</h2>
      <ol>
        <li>Entra a Coinbase</li>
        <li>Ve a tus activos → Solana (SOL)</li>
        <li>Pulsa "Enviar" o "Send"</li>
        <li>Pega tu dirección de Phantom</li>
        <li>Cantidad: empieza con una cantidad <strong>pequeña de prueba</strong> (ej: $5 en SOL)</li>
        <li>Confirma</li>
      </ol>
      <blockquote>
        🔑 <strong>REGLA DE ORO:</strong> la primera vez que mandas a una wallet nueva, <strong>siempre prueba con poco dinero primero</strong>. Si esos $5 llegan bien, ya mandas el resto.
      </blockquote>
      <p>⏱️ El SOL llega a Phantom en segundos. Si tarda más de 2-3 minutos, comprueba que la dirección sea correcta.</p>

      <h2>Paso 6 — Verificar que llegó</h2>
      <p>Abre Phantom. Deberías ver tu balance de SOL actualizado.</p>
      <p>Si no aparece al instante:</p>
      <ul>
        <li>Espera 1-2 minutos</li>
        <li>Cierra y abre la app</li>
        <li>Si después de 5 min no aparece, verifica en <strong>solscan.io</strong> poniendo tu dirección</li>
      </ul>

      <h2>Recordatorios de seguridad</h2>
      <p>🔒 La frase semilla NUNCA sale del papel</p>
      <p>🔒 Nunca apruebes transacciones que no entiendas</p>
      <p>🔒 Si alguien te escribe diciendo "soy de Phantom/Witleik y necesito tu frase" → es un scam, bloquéalo</p>
      <p>🔒 Activa la huella o Face ID en la app de Phantom</p>
    </LeccionLayout>
  );
}
