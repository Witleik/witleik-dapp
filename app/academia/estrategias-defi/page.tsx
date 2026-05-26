"use client";

import { LeccionLayout } from "@/components/LeccionLayout";
import { LeccionPremiumGate } from "@/components/LeccionPremiumGate";

export default function EstrategiasDeFi() {
  return (
    <LeccionPremiumGate>
      <LeccionLayout
        numero="06"
        titulo="Estrategias DeFi para ganar dinero en Solana"
        duracion="25 minutos"
        nivel="Intermedio / Avanzado"
        necesitas="1,000 $WITX + experiencia básica DeFi"
        anterior={{ slug: "seguridad-avanzada", titulo: "Seguridad avanzada en cripto" }}
      >
        <h2>Las 5 estrategias que mueven el dinero en Solana</h2>
        <p>
          DeFi en Solana es un menú gigante. Esta lección filtra las 5 estrategias que realmente generan rendimiento, ordenadas de menos a más riesgo. Cada una con: qué es, cómo se hace, riesgo real, y cuándo NO usarla.
        </p>
        <blockquote>
          ⚠️ Los APYs son rangos generales basados en condiciones de mercado normales. Pueden cambiar mucho. Verifica siempre la cifra real en el protocolo antes de operar.
        </blockquote>

        <h2>1. Lending estable (riesgo bajo)</h2>
        <h3>Qué es</h3>
        <p>
          Depositas USDC en un protocolo de préstamos. Otros usuarios piden ese USDC prestado y pagan interés. Tú recibes ese interés en proporción a lo que aportaste.
        </p>
        <h3>APY esperado</h3>
        <p>Entre 3-8% APY en USDC. Cuando hay mucha demanda de préstamos puede llegar a 10-15% temporalmente.</p>
        <h3>Dónde hacerlo</h3>
        <ul>
          <li><strong>Kamino Earn</strong> — el más usado, vaults optimizados</li>
          <li><strong>MarginFi</strong> — alternativa sólida</li>
          <li><strong>Drift Insurance</strong> — yield más alto pero con riesgo adicional</li>
        </ul>
        <h3>Riesgos reales</h3>
        <ul>
          <li>Hack del smart contract (raro pero ha pasado en otros protocolos)</li>
          <li>Despeg del USDC (si USDC pierde el valor a $1, pierdes proporcionalmente)</li>
          <li>Liquidez insuficiente para retirar en momentos de pánico</li>
        </ul>
        <h3>Cuándo NO usarlo</h3>
        <p>Si necesitas ese dinero líquido en menos de una semana, mejor déjalo en la wallet.</p>

        <h2>2. Apalancamiento responsable (riesgo medio)</h2>
        <h3>Qué es</h3>
        <p>
          Depositas un activo como colateral (SOL, BTC, etc) y pides prestado contra él. Útil cuando quieres liquidez sin vender tu activo.
        </p>
        <h3>Cuándo tiene sentido</h3>
        <ul>
          <li>Necesitas USDC para algo y no quieres vender tu SOL</li>
          <li>Quieres mantener exposición al activo pero usar el dinero para otra cosa</li>
          <li>Vas a hacer un carry trade (siguiente estrategia)</li>
        </ul>
        <h3>Reglas para no liquidarte</h3>
        <ol>
          <li>LTV máximo 40% si no tienes experiencia</li>
          <li>Activos volátiles (SOL, BTC) requieren más margen que estables</li>
          <li>Nunca pidas prestado el máximo que te deja el protocolo</li>
          <li>Monitorear la posición diariamente</li>
        </ol>
        <h3>Dónde hacerlo</h3>
        <p><strong>Kamino Main Market</strong> es el más usado. Drift y MarginFi también funcionan.</p>

        <h2>3. Carry trade SOL/USDC (riesgo medio-alto)</h2>
        <h3>Qué es</h3>
        <p>
          La estrategia núcleo del fondo Witleik. Usas SOL como colateral, pides USDC prestado, y despliegas ese USDC en yield estable. Mantienes exposición a SOL Y generas rendimiento adicional.
        </p>
        <h3>APY neto esperado</h3>
        <p>
          Entre 5-15% APY sobre tu capital, dependiendo del spread (yield del USDC menos el interés del préstamo). Cuando OnRe paga ~13% y el préstamo cuesta ~5%, el spread neto es ~8% multiplicado por el apalancamiento.
        </p>
        <h3>Riesgo principal</h3>
        <p>
          Liquidación si SOL cae fuerte. Por eso el LTV se controla obsesivamente.
        </p>
        <h3>Ejecución resumida</h3>
        <ol>
          <li>Depositar SOL en Kamino</li>
          <li>Borrow USDC al 30-40% LTV</li>
          <li>Desplegar USDC en OnRe o lending estable</li>
          <li>Monitorear LTV y spread</li>
        </ol>
        <p>
          Esta estrategia tiene su propia lección dedicada (Lección 4 — Carry trade desde cero). Léela antes de ejecutar.
        </p>

        <h2>4. Loops de yield (riesgo medio-alto)</h2>
        <h3>Qué es</h3>
        <p>
          Multiplicar tu APY mediante bucles: depositas, pides prestado, vuelves a depositar lo prestado, vuelves a pedir prestado... cada ciclo amplifica el rendimiento Y el riesgo.
        </p>
        <h3>Ejemplo concreto</h3>
        <p>
          Depositas $1,000 en JLP (Jupiter LP token) que paga ~25% APY. Pides prestado $500 USDC contra ese JLP. Conviertes el USDC en más JLP. Vuelves a pedir prestado contra el nuevo JLP. Repites.
        </p>
        <h3>APY resultante</h3>
        <p>
          Puedes pasar de 25% a 50-80% APY en condiciones normales. En condiciones malas (despeg, cambio de precio del activo loopeado), pierdes capital rápido.
        </p>
        <h3>Dónde hacerlo</h3>
        <p>
          <strong>Kamino Multiply</strong> tiene loops automatizados pre-configurados con SOL líquido staked (jitoSOL, mSOL) que simplifican mucho la ejecución.
        </p>
        <h3>Riesgos reales</h3>
        <ul>
          <li>Despeg del activo loopeado (si jitoSOL se separa del precio de SOL)</li>
          <li>Subida del interés del préstamo (cambia el spread)</li>
          <li>Liquidación en cascada si el activo cae fuerte</li>
        </ul>
        <h3>Cuándo NO usarlo</h3>
        <p>
          Si no entiendes exactamente qué activo estás loopeando, qué tasa pagas y qué tasa recibes, NO lo hagas. Es la estrategia que más gente ha liquidado en Solana.
        </p>

        <h2>5. Liquidity pools (riesgo alto)</h2>
        <h3>Qué es</h3>
        <p>
          Aportas dos tokens (ej. SOL + USDC) a un pool de liquidez en Orca o Raydium. Otros usuarios hacen swaps en ese pool y tú cobras una comisión de cada operación.
        </p>
        <h3>APY esperado</h3>
        <p>
          Muy variable: 10-200%+ dependiendo del par, el volumen y si es una posición concentrada. Pero ese APY puede ser comido fácilmente por la siguiente cosa:
        </p>
        <h3>Impermanent loss (la gran trampa)</h3>
        <p>
          Si los dos tokens del pool se mueven en precios diferentes, acabas con menos valor que si simplemente los hubieras tenido en wallet. Cuanto más volátil el par, más impermanent loss.
        </p>
        <p>
          Ejemplo: aportas SOL/USDC al 50/50. SOL sube fuerte. El pool te deja con más USDC y menos SOL. Si SOL sigue subiendo, tu posición vale menos que si hubieras hold SOL puro.
        </p>
        <h3>Pools concentrados (Orca)</h3>
        <p>
          Permites elegir un rango de precio donde aportar liquidez. Si el precio se queda dentro del rango, ganas mucho. Si se sale, dejas de ganar comisiones Y tienes impermanent loss máximo.
        </p>
        <h3>Cuándo tiene sentido</h3>
        <ul>
          <li>Pares estables (USDC/USDT) — bajo IL, APY 3-8%</li>
          <li>Pares correlacionados (SOL/jitoSOL) — bajo IL, APY moderado</li>
          <li>Pares volátiles solo si entiendes el riesgo y vas a monitorear activamente</li>
        </ul>
        <h3>Cuándo NO usarlo</h3>
        <p>
          Si quieres "set and forget", olvídalo. Los LP requieren atención y rebalanceo. Mejor lending para pasivo.
        </p>

        <h2>Cuál elegir según tu perfil</h2>
        <ul>
          <li><strong>Quiero rendimiento pasivo bajo riesgo</strong> → Lending estable</li>
          <li><strong>Necesito liquidez sin vender mi SOL</strong> → Apalancamiento conservador</li>
          <li><strong>Quiero replicar lo que hace Witleik</strong> → Carry trade</li>
          <li><strong>Tengo experiencia y quiero rendimiento alto</strong> → Loops controlados</li>
          <li><strong>Soy operador activo</strong> → Liquidity pools concentrados</li>
        </ul>

        <h2>Reglas universales para DeFi</h2>
        <ol>
          <li><strong>Empieza con cantidades pequeñas</strong> para entender el comportamiento real antes de escalar</li>
          <li><strong>No persigas APYs altos sin entender el riesgo</strong> — si paga 100% y nadie lo está haciendo, hay una razón</li>
          <li><strong>Diversifica entre protocolos</strong> — no todo en uno solo, aunque sea el "más seguro"</li>
          <li><strong>Anota tus operaciones</strong> — entrada, salida, APY real conseguido (no el prometido)</li>
          <li><strong>Las ganancias en yield son comparables al riesgo asumido</strong> — siempre</li>
        </ol>

        <h2>Stack recomendado para empezar</h2>
        <ol>
          <li>50% en Lending estable (Kamino Earn USDC)</li>
          <li>30% en Carry trade con LTV bajo</li>
          <li>20% libre para experimentar con loops o LPs pequeños</li>
        </ol>
        <p>
          Este es un punto de partida razonable. A medida que entiendas mejor cada estrategia, ajustas la distribución a tu perfil.
        </p>

        <h2>Próximo paso</h2>
        <p>
          Empieza por una sola estrategia (lending estable es la más segura para aprender). Opera durante 2-4 semanas con cantidad pequeña. Cuando entiendas el flujo real, escalas o añades una segunda estrategia.
        </p>
        <p>
          <strong>El error más caro en DeFi es ir a por todas a la vez sin haber operado nunca cada cosa por separado.</strong>
        </p>
      </LeccionLayout>
    </LeccionPremiumGate>
  );
}
