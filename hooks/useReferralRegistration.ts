'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useReferralRegistration() {
  const { publicKey, connected } = useWallet();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    // Solo ejecutar cuando hay conexión real y wallet pública disponible
    if (!connected || !publicKey) {
      hasAttemptedRef.current = false;
      return;
    }

    // Evitar intentos duplicados en la misma sesión de conexión
    if (hasAttemptedRef.current) return;

    const referrerWallet = localStorage.getItem('witleik_referrer');
    if (!referrerWallet) return;

    const referredWallet = publicKey.toBase58();

    // Si el usuario es el mismo que el referrer, limpiar y salir
    if (referrerWallet === referredWallet) {
      localStorage.removeItem('witleik_referrer');
      localStorage.removeItem('witleik_referrer_timestamp');
      return;
    }

    // Verificar que el referido no esté expirado (30 días máximo)
    const timestamp = localStorage.getItem('witleik_referrer_timestamp');
    if (timestamp) {
      const ageMs = Date.now() - parseInt(timestamp);
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (ageMs > thirtyDaysMs) {
        localStorage.removeItem('witleik_referrer');
        localStorage.removeItem('witleik_referrer_timestamp');
        return;
      }
    }

    hasAttemptedRef.current = true;

    // Llamar al endpoint
    fetch('/api/referral/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrer_wallet: referrerWallet,
        referred_wallet: referredWallet,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        // 201 = creado, 409 = ya existía. Ambos son OK para limpiar localStorage
        if (res.ok || res.status === 409) {
          localStorage.removeItem('witleik_referrer');
          localStorage.removeItem('witleik_referrer_timestamp');
          console.log('[Witleik Referral] Registered or already exists:', data);
        } else {
          console.error('[Witleik Referral] Failed:', data);
          // Permitir reintento en próxima conexión si fue error de red/servidor
          hasAttemptedRef.current = false;
        }
      })
      .catch((err) => {
        console.error('[Witleik Referral] Network error:', err);
        hasAttemptedRef.current = false;
      });
  }, [connected, publicKey]);
}
