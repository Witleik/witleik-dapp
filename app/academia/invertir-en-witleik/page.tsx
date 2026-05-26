import { LeccionLayout } from "@/components/LeccionLayout";

export default function InvertirEnWitleik() {
  return (
    <LeccionLayout
      numero="03"
      titulo="Cómo invertir en Witleik"
      duracion="10 minutos"
      nivel="Principiante"
      necesitas="Phantom con SOL dentro"
      anterior={{ slug: "phantom", titulo: "Instalar Phantom y mover tu SOL" }}
    >
      <h2>¿Qué vas a hacer exactamente?</h2>
      <p>
        Vas a <strong>cambiar SOL por $WITX</strong> en Jupiter, la plataforma de swaps más usada en Solana. Comprando $WITX te conviertes en parte del fondo Witleik. Cuanto más rinda el fondo, más vale tu posición.
      </p>

      <h2>Antes de empezar</h2>
      <p>✅ <strong>Inversión mínima recomendada:</strong> $20 USD (≈ 1,000 $WITX)</p>
      <p>✅ <strong>Comisión de red en Solana:</strong> céntimos</p>
      <p>✅ <strong>Slippage:</strong> un poquito de diferencia entre precio mostrado y precio real. Normal.</p>
      <p>⚠️ $WITX es un activo, su precio puede subir o bajar según mercado</p>

      <h2>Paso 1 — Abrir Jupiter</h2>
      <p>Ve a <strong>jup.ag</strong></p>
      <blockquote>
        ⚠️ <strong>CUIDADO con webs falsas.</strong> Asegúrate de que la URL sea exactamente <strong>jup.ag</strong> (no jup.com, ni jupiter.io). Guarda la web en favoritos.
      </blockquote>

      <h2>Paso 2 — Conectar tu Phantom</h2>
      <ol>
        <li>En la esquina superior derecha pulsa "Connect Wallet"</li>
        <li>Selecciona Phantom</li>
        <li>Phantom te pedirá confirmar la conexión → Aceptar</li>
      </ol>
      <p>💡 Conectar la wallet NO le da acceso a tu dinero a Jupiter. Solo le permite leer tu balance y proponerte transacciones que TÚ tienes que firmar.</p>

      <h2>Paso 3 — Buscar $WITX</h2>
      <p>En el campo de "To" (cambiar a):</p>
      <ol>
        <li>Pulsa el selector de token</li>
        <li>Copia y pega el contrato oficial de $WITX:</li>
      </ol>
      <pre><code>irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8</code></pre>
      <blockquote>
        ⚠️ <strong>MUY IMPORTANTE:</strong> existen tokens falsos con nombres parecidos. Usa SIEMPRE este contrato.
      </blockquote>

      <h2>Paso 4 — Hacer el swap</h2>
      <ol>
        <li>En el campo "From" pon <strong>SOL</strong></li>
        <li>En "To" pon <strong>WITX</strong> (con el contrato del paso anterior)</li>
        <li>Introduce la cantidad de SOL que quieres invertir</li>
        <li>Jupiter te muestra cuánto $WITX vas a recibir</li>
        <li>Revisa que el slippage esté entre 0.5% y 1%</li>
        <li>Pulsa "Swap"</li>
        <li>Phantom abrirá un popup → revisa la transacción → "Confirm"</li>
      </ol>
      <p>⏱️ En 2-3 segundos tendrás $WITX en tu wallet.</p>

      <h2>Paso 5 — Verificar que tienes $WITX</h2>
      <ol>
        <li>Abre Phantom</li>
        <li>Ve a tus tokens → busca WITX</li>
        <li>Si no aparece de primeras, dale a "Manage Token List" o tira la pantalla hacia abajo para refrescar</li>
      </ol>

      <h2>🎉 Felicidades. Eres parte de Witleik.</h2>
      <p><strong>Lo que tienes ahora:</strong></p>
      <ul>
        <li>$WITX en tu wallet</li>
        <li>Acceso al ecosistema Witleik</li>
        <li>Tu valor crece con los resultados del fondo (las ganancias se reinvierten en recompras del propio token)</li>
      </ul>

      <p><strong>Próximos pasos:</strong></p>
      <ol>
        <li>Únete a la comunidad pública: <a href="https://t.me/witleiksocietywitx" target="_blank" rel="noopener noreferrer">Witleik Society en Telegram</a></li>
        <li>Si tienes 100 $WITX o más: accede al grupo privado de holders</li>
        <li>Si tienes 1,000 $WITX: desbloqueas la <strong>Academia Premium</strong></li>
        <li>Cualquier duda: WhatsApp con Manza → +1 (443) 864-1223</li>
      </ol>

      <h2>Recordatorios importantes</h2>
      <p>🔒 Guarda bien el contrato de $WITX. Nunca compres de otro contrato</p>
      <p>🔒 Witleik nunca te pedirá enviar dinero a una dirección random</p>
      <p>🔒 Si alguien por DM te dice "soy de Witleik, mándame X" → es scam</p>
      <p><strong>Bienvenido a Witleik.</strong></p>
    </LeccionLayout>
  );
}
