"use client";

import { LeccionLayout } from "@/components/LeccionLayout";
import { LeccionPremiumGate } from "@/components/LeccionPremiumGate";

export default function SeguridadAvanzada() {
  return (
    <LeccionPremiumGate>
      <LeccionLayout
        numero="05"
        titulo="Seguridad avanzada en cripto"
        duracion="15 minutos"
        nivel="Intermedio"
        necesitas="1,000 $WITX"
        anterior={{ slug: "carry-trade", titulo: "Carry trade desde cero" }}
        siguiente={{ slug: "estrategias-defi", titulo: "Estrategias DeFi para ganar dinero" }}
      >
        <h2>¿Por qué este tema importa más que cualquier estrategia?</h2>
        <p>
          Puedes hacer el mejor carry trade del mundo, pero si te drenan la wallet o te roban la frase semilla, lo pierdes todo en segundos. <strong>La seguridad es la base.</strong>
        </p>

        <h2>Nivel 1 — Hardware wallet (Ledger / Trezor)</h2>
        <h3>¿Qué es?</h3>
        <p>
          Un dispositivo físico (USB o Bluetooth) que guarda tu frase semilla offline. Para firmar cualquier transacción tienes que aprobarla físicamente con un botón.
        </p>
        <h3>¿Cuándo merece la pena?</h3>
        <ul>
          <li>Cuando tu wallet pasa de <strong>$1,000 USD</strong> aproximadamente</li>
          <li>Si vas a operar durante años</li>
          <li>Si haces DeFi activo (más exposición a contratos)</li>
        </ul>
        <h3>Cuál comprar</h3>
        <p>
          Los dos estándar son <strong>Ledger Nano S Plus</strong> (~$80) y <strong>Trezor Safe 3</strong> (~$80). Ambos compatibles con Phantom.
        </p>
        <blockquote>
          ⚠️ <strong>Compra SIEMPRE en la web oficial del fabricante.</strong> Nunca en Amazon, eBay o tienda física random. Los hardware wallets manipulados existen y te drenan al primer uso.
        </blockquote>

        <h2>Nivel 2 — Separación de wallets por uso</h2>
        <p>
          Un error común: usar la misma wallet para todo. Si la conectas a una dApp maliciosa, pierdes todo de golpe. La solución es separar:
        </p>
        <ul>
          <li><strong>Wallet fría (cold):</strong> hardware wallet. Solo guarda tu capital principal. NO se conecta a dApps. Recibe y envía manualmente.</li>
          <li><strong>Wallet caliente (hot) operativa:</strong> Phantom con poco saldo (lo justo para operar la semana). Conectas a dApps con esta.</li>
          <li><strong>Wallet experimental:</strong> Phantom separada para probar protocolos nuevos. Saldo mínimo.</li>
        </ul>
        <p>
          Mueves capital de la fría a la operativa cuando lo necesitas. Así si te drenan algo, pierdes lo poco que tenías en esa wallet, no todo.
        </p>

        <h2>Nivel 3 — Reconocer scams reales</h2>
        <h3>1. DMs falsos haciéndose pasar por soporte</h3>
        <p>
          "Hola, soy del soporte de Phantom/Witleik/Jupiter, necesito tu frase para verificar tu cuenta". <strong>Bloquear al instante.</strong> Ningún servicio legítimo pide tu frase NUNCA.
        </p>
        <h3>2. Airdrops falsos</h3>
        <p>
          Te aparece un token en la wallet que no compraste, con un nombre llamativo. Intentas venderlo en Jupiter y la transacción te pide aprobar permisos raros → drainer. <strong>Ignóralo. Déjalo en la wallet sin tocar.</strong>
        </p>
        <h3>3. Páginas clonadas de protocolos</h3>
        <p>
          Buscas "Jupiter" en Google, haces click en el anuncio, te lleva a "jup-ag.io" en vez de "jup.ag", conectas wallet, firmas algo → drenado. <strong>Solución: guarda los protocolos que uses en favoritos.</strong>
        </p>
        <h3>4. Falsos "ganaste un NFT/un premio/un acceso VIP"</h3>
        <p>
          Cualquier mensaje no solicitado que te ofrezca dinero gratis es un scam. <strong>Sin excepciones.</strong>
        </p>
        <h3>5. Aprobaciones infinitas</h3>
        <p>
          Algunos contratos te piden "approve unlimited" para mover tokens. Si firmas eso en un contrato malicioso, pueden vaciar ese token cuando quieran. <strong>Aprueba solo la cantidad exacta que necesites.</strong>
        </p>

        <h2>Nivel 4 — Revisar y revocar permisos</h2>
        <p>
          Cada vez que firmas una "approval" en un contrato, ese contrato puede mover tus tokens. Con el tiempo acumulas decenas de permisos. Hay que limpiarlos:
        </p>
        <ol>
          <li>Ve a <strong>revoke.cash</strong> (versión Solana)</li>
          <li>Conecta tu wallet</li>
          <li>Verás la lista de aprobaciones activas</li>
          <li>Revoca todo lo que no uses actualmente</li>
        </ol>
        <p>Haz esta limpieza una vez al mes. Tarda 5 minutos y previene el 80% de los drenados pasivos.</p>

        <h2>Nivel 5 — Qué hacer SI te hackean</h2>
        <p>Si sospechas que te han comprometido la wallet:</p>
        <ol>
          <li><strong>Mueve todo lo que puedas a una wallet nueva</strong> inmediatamente, empezando por lo de más valor</li>
          <li>Si tu frase semilla está comprometida, esa wallet está MUERTA. No vuelvas a usarla nunca</li>
          <li>Crea una wallet nueva con frase semilla NUEVA (no reutilices)</li>
          <li>Revoca aprobaciones en la wallet vieja para frenar drenados activos</li>
          <li>Si era cantidad seria, denuncia con hash de transacción a Solscan y a las autoridades locales</li>
        </ol>
        <blockquote>
          ⚠️ Las cripto robadas casi nunca se recuperan. La prevención lo es todo.
        </blockquote>

        <h2>Checklist de seguridad mensual</h2>
        <ul>
          <li>☐ Revoco aprobaciones no usadas en revoke.cash</li>
          <li>☐ Reviso transacciones del mes en Solscan, busco cualquier movimiento que no reconozca</li>
          <li>☐ Verifico que mi hardware wallet sigue funcionando y la frase semilla sigue accesible</li>
          <li>☐ Actualizo extensión de Phantom a la última versión</li>
          <li>☐ Reviso permisos del navegador (que no haya extensiones nuevas raras)</li>
        </ul>

        <h2>Reglas inamovibles</h2>
        <ol>
          <li>La frase semilla NUNCA sale del papel</li>
          <li>Hardware wallet en cuanto pases de $1,000</li>
          <li>Wallets separadas por uso (fría / operativa / experimental)</li>
          <li>Webs solo desde favoritos, nunca desde Google ads</li>
          <li>Revisar aprobaciones cada mes</li>
          <li>Si dudas de algo, NO lo firmes</li>
        </ol>
      </LeccionLayout>
    </LeccionPremiumGate>
  );
}
