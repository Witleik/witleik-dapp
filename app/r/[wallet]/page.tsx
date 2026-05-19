'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ReferralCapturePage({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const router = useRouter();
  const { wallet } = use(params);

  useEffect(() => {
    if (!wallet) return;

    // Validación básica: las wallets de Solana son base58 de 32-44 caracteres
    const isValidWallet = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet);

    if (isValidWallet) {
      localStorage.setItem('witleik_referrer', wallet);
      localStorage.setItem('witleik_referrer_timestamp', Date.now().toString());
    }

    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [wallet, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0b0b',
      color: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '3px solid rgba(35, 231, 255, 0.2)',
        borderTopColor: '#23e7ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '30px'
      }} />
      <h1 style={{
        fontSize: '1.5rem',
        marginBottom: '10px',
        color: '#23e7ff'
      }}>
        Bienvenido a Witleik
      </h1>
      <p style={{ color: '#a1a1a6', fontSize: '0.95rem' }}>
        Has sido invitado por un miembro de Witleik Society
      </p>
      <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '20px' }}>
        Redirigiendo...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
