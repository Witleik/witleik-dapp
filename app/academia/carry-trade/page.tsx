"use client";

import { LeccionLayout } from "@/components/LeccionLayout";
import { LeccionPremiumGate } from "@/components/LeccionPremiumGate";

export default function CarryTrade() {
  return (
    <LeccionPremiumGate>
      <LeccionLayout
        numero="04"
        titulo="Carry trade desde cero"
        duracion="20 minutos"
        nivel="Intermedio"
        necesitas="Phantom con SOL + 1,000 $WITX"
        anterior={{ slug: "invertir-en-witleik", titulo: "Cómo invertir en Witleik" }}
        siguiente={{ slug: "seguridad-avanzada", titulo: "Seguridad avanzada en cripto" }}
      >
        <h2>¿Qué es un carry trade?</h2>
        <p>
          Un carry trade consiste en pedir prestado un activo barato y desplegarlo en algo que rinda más. En Solana lo hacemos así:
        </p>
        <ol>
          <li>Depositas <strong>SOL</strong> como colateral en Kamino</li>
          <li>Pides prestado <strong>USDC</strong> contra ese SOL</li>
          <li>Despliegas ese USDC en un protocolo que paga yield estable (OnRe, lending, etc)</li>
        </ol>
        <p>
          Resultado: mantienes tu exposición a SOL (sigue creciendo si SOL sube) Y generas rendimiento adicional con el USDC prestado. Es la estrategia núcleo del fondo Witleik.
        </p>

        <blockquote>
          ⚠️ <strong>Aviso real:</strong> esta estrategia tiene riesgo de liquidación. Si SOL cae fuerte, puedes perder tu colateral. Léelo todo antes de ejecutarlo con dinero real.
        </blockquote>

        <h2>Conceptos que tienes que entender antes</h2>
        <h3>LTV (Loan-to-Value)</h3>
        <p>
          Es la relación entre lo que pides prestado y el valor de tu colateral. Si depositas $1,000 en SOL y pides $500 en USDC, tu LTV es del 50%.
        </p>
        <p>
          <strong>Cuanto más alto el LTV, más cerca estás de la liquidación.</strong> Cada protocolo tiene un LTV máximo (en Kamino, para SOL, suele estar entre 70-80%).
        </p>

        <h3>Liquidación</h3>
        <p>
          Si SOL cae mucho, tu colateral vale menos y el LTV sube. Cuando llega al límite, el protocolo vende automáticamente parte de tu SOL para cubrir la deuda. Pagas una penalización (~5-10%) y pierdes capital.
        </p>

        <h3>Spread</h3>
        <p>
          La diferencia entre lo que <strong>te cuesta</strong> el préstamo de USDC (interés que pagas) y lo que <strong>te paga</strong> el protocolo donde despliegas ese USDC. Esa diferencia es tu ganancia neta.
        </p>

        <h2>Paso 1 — Entrar a Kamino</h2>
        <ol>
          <li>Ve a <strong>app.kamino.finance</strong></li>
          <li>Conecta tu Phantom</li>
          <li>Ve a "Lending" o "Borrow"</li>
        </ol>

        <h2>Paso 2 — Depositar SOL como colateral</h2>
        <ol>
          <li>Selecciona <strong>SOL</strong> en la lista de mercados</li>
          <li>Pulsa "Deposit"</li>
          <li>Introduce la cantidad de SOL que quieres usar como colateral</li>
          <li>Marca la casilla "Use as collateral"</li>
          <li>Confirma la transacción en Phantom</li>
        </ol>

        <h2>Paso 3 — Pedir USDC prestado</h2>
        <p>Aquí es donde tienes que tener cabeza:</p>
        <ol>
          <li>Selecciona <strong>USDC</strong></li>
          <li>Pulsa "Borrow"</li>
          <li><strong>Decide tu LTV objetivo</strong>. Para empezar, no pases del 40%. Eso te da margen para que SOL caiga ~40-50% sin liquidarte.</li>
          <li>Introduce la cantidad de USDC a pedir</li>
          <li>Revisa la tasa de interés que vas a pagar</li>
          <li>Confirma</li>
        </ol>

        <blockquote>
          💡 <strong>Regla práctica:</strong> empezar con LTV bajo (30-40%) y solo subirlo cuando entiendes bien cómo se mueve tu posición. Witleik nunca pasa del 60%.
        </blockquote>

        <h2>Paso 4 — Desplegar el USDC en yield</h2>
        <p>Ahora tienes USDC prestado en tu wallet. Toca ponerlo a trabajar. Opciones reales:</p>
        <ul>
          <li><strong>OnRe</strong> (onre.fi) — yield basado en reaseguros, suele estar entre 8-15% APY</li>
          <li><strong>Kamino Earn USDC</strong> — lending USDC dentro del propio Kamino</li>
          <li><strong>Drift Insurance Fund</strong> — yield estable variable</li>
          <li><strong>MarginFi USDC</strong> — lending alternativo</li>
        </ul>
        <p><strong>Hazlo simple al principio.</strong> Una sola opción. Cuando entiendas cómo funciona, puedes diversificar.</p>

        <h2>Paso 5 — Monitorear tu posición</h2>
        <p>Esto NO es "set and forget". Tienes que revisarla periódicamente:</p>
        <ul>
          <li><strong>Diario:</strong> mirar precio de SOL y tu LTV actual en Kamino</li>
          <li><strong>Semanal:</strong> verificar APY del lado del préstamo y del despliegue (si el spread se vuelve negativo, cierras)</li>
          <li><strong>Alertas:</strong> activa notificaciones en Kamino si tu salud baja de cierto umbral</li>
        </ul>

        <h2>Cuándo cerrar la posición</h2>
        <ul>
          <li>Si el spread (yield - interés del préstamo) se vuelve negativo</li>
          <li>Si SOL empieza a caer fuerte y tu LTV se acerca al 60%</li>
          <li>Si encuentras una mejor oportunidad para ese capital</li>
          <li>Si simplemente quieres salir y consolidar</li>
        </ul>
        <p>Para cerrar: vendes el yield del USDC, devuelves el préstamo a Kamino, retiras tu SOL. En ese orden.</p>

        <h2>Errores comunes que destrozan posiciones</h2>
        <ul>
          <li>❌ Empezar con LTV alto (60%+) sin haber operado nunca esto antes</li>
          <li>❌ No mirar la posición durante semanas</li>
          <li>❌ Reinvertir las ganancias también prestadas (apalancamiento sobre apalancamiento)</li>
          <li>❌ Pedir prestado en momentos de alta volatilidad sin colchón</li>
          <li>❌ Olvidarse de los intereses del préstamo (suben con el tiempo)</li>
        </ul>

        <h2>Capital mínimo recomendado</h2>
        <p>Para que merezca la pena con las comisiones, mínimo unos <strong>$200-300 USD en SOL</strong>. Por debajo de eso, el gas y el rebalanceo se comen el rendimiento.</p>

        <h2>Resumen accionable</h2>
        <ol>
          <li>Deposita SOL como colateral en Kamino</li>
          <li>Pide prestado USDC con LTV máximo 40% (al principio)</li>
          <li>Despliega ese USDC en OnRe o lending estable</li>
          <li>Monitorea LTV diario, spread semanal</li>
          <li>Cierra cuando el spread sea negativo o SOL caiga fuerte</li>
        </ol>

        <p><strong>Empezar con poco dinero, ver cómo se mueve la posición durante 2-4 semanas, y solo escalar cuando ya entiendas el comportamiento real.</strong></p>
      </LeccionLayout>
    </LeccionPremiumGate>
  );
}
