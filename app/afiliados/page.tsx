'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWitxBalance } from '@/hooks/useWitxBalance';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MIN_WITX_REQUIRED = 1000;
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://witleikcapital.com';

interface Referral {
  id: string;
  referred_wallet: string;
  referred_wallet_short: string;
  created_at: string;
  status: string;
  qualifying_swap_usd: number | null;
  reward_witx: number | null;
}

interface Stats {
  total: number;
  pending: number;
  qualified: number;
  paid: number;
  total_witx_earned: number;
  pending_witx_claim: number;
}

export default function AfiliadosPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { balance, loading: balanceLoading } = useWitxBalance();

  const [stats, setStats] = useState<Stats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const balanceNum = balance ?? 0;
  const hasAccess = connected && publicKey && balanceNum >= MIN_WITX_REQUIRED;
  const walletAddress = publicKey?.toBase58() || '';
  const referralLink = walletAddress ? `${BASE_URL}/r/${walletAddress}` : '';

  // Fetch stats cuando hay acceso
  useEffect(() => {
    if (!hasAccess || !walletAddress) return;

    setLoading(true);
    fetch(`/api/referral/stats?wallet=${walletAddress}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setReferrals(data.referrals || []);
        }
      })
      .catch((err) => console.error('Error fetching stats:', err))
      .finally(() => setLoading(false));
  }, [hasAccess, walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // NIVEL 1: Sin wallet conectada
  if (!connected || !publicKey) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={iconStyle}>🔒</div>
          <h1 style={titleStyle}>Programa de Afiliados Witleik</h1>
          <p style={descStyle}>
            Conecta tu wallet para acceder al programa de afiliados.
          </p>
          <p style={subtextStyle}>
            Gana <strong style={{ color: '#23e7ff' }}>5% en $WITX</strong> por cada nuevo inversor que traigas al fondo.
          </p>
        </div>
      </div>
    );
  }

  // NIVEL 2: Wallet conectada pero sin holding suficiente
  if (balanceNum < MIN_WITX_REQUIRED) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={iconStyle}>⚡</div>
          <h1 style={titleStyle}>Requisito de Afiliado</h1>
          <p style={descStyle}>
            Para ser afiliado de Witleik necesitas mantener un mínimo de:
          </p>
          <div style={requirementStyle}>
            <strong style={{ color: '#23e7ff', fontSize: '2rem' }}>
              1,000 $WITX
            </strong>
          </div>
          <p style={subtextStyle}>
            Tu balance actual: <strong>{balanceNum.toFixed(2)} $WITX</strong>
          </p>
          <p style={subtextStyle}>
            Te faltan: <strong style={{ color: '#23e7ff' }}>
              {(MIN_WITX_REQUIRED - balanceNum).toFixed(2)} $WITX
            </strong>
          </p>
          <button onClick={() => router.push('/swap')} style={buttonStyle}>
            Comprar $WITX
          </button>
          <p style={{ ...subtextStyle, marginTop: '20px', fontSize: '0.85rem' }}>
            Este requisito garantiza que solo afiliados comprometidos representen a Witleik en su comunidad.
          </p>
        </div>
      </div>
    );
  }

  // NIVEL 3: Dashboard completo
  return (
    <div style={{ ...containerStyle, alignItems: 'flex-start' }}>
      <div style={dashboardContainerStyle}>
        {/* Header */}
        <div style={dashboardHeaderStyle}>
          <h1 style={dashboardTitleStyle}>Programa de Afiliados</h1>
          <p style={dashboardSubtitleStyle}>
            Comparte tu link y gana 5% en $WITX por cada inversor que traigas
          </p>
        </div>

        {/* Card del link */}
        <div style={linkCardStyle}>
          <p style={linkLabelStyle}>Tu link de referido</p>
          <div style={linkBoxStyle}>
            <code style={linkTextStyle}>{referralLink}</code>
          </div>
          <button onClick={handleCopy} style={copyButtonStyle}>
            {copied ? '✓ Copiado' : 'Copiar link'}
          </button>
        </div>

        {/* Stats grid */}
        <div style={statsGridStyle}>
          <StatCard label="Total referidos" value={stats?.total ?? '—'} />
          <StatCard label="Pendientes" value={stats?.pending ?? '—'} color="#ffb800" />
          <StatCard label="Cualificados" value={stats?.qualified ?? '—'} color="#00ff88" />
          <StatCard
            label="$WITX ganados"
            value={stats?.total_witx_earned?.toFixed(0) ?? '—'}
            color="#23e7ff"
          />
        </div>

        {/* Tabla de referidos */}
        <div style={tableContainerStyle}>
          <h2 style={sectionTitleStyle}>Mis referidos</h2>
          {loading ? (
            <p style={emptyStateStyle}>Cargando...</p>
          ) : referrals.length === 0 ? (
            <p style={emptyStateStyle}>
              Todavía no tienes referidos. Comparte tu link para empezar a ganar.
            </p>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Wallet</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} style={trStyle}>
                      <td style={tdStyle}>{r.referred_wallet_short}</td>
                      <td style={tdStyle}>
                        {new Date(r.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Cómo funciona */}
        <div style={howItWorksStyle}>
          <h2 style={sectionTitleStyle}>Cómo funciona</h2>
          <ol style={howListStyle}>
            <li style={howItemStyle}>
              <strong>Comparte tu link</strong> en redes, WhatsApp o con tu comunidad.
            </li>
            <li style={howItemStyle}>
              Tu referido entra a Witleik, conecta wallet y compra <strong>$WITX</strong> (mínimo $50).
            </li>
            <li style={howItemStyle}>
              Tu comisión del <strong>5%</strong> en $WITX queda registrada como "cualificada".
            </li>
            <li style={howItemStyle}>
              Reclamas tus $WITX mensualmente. Ventana de comisión recurrente: <strong>90 días</strong> desde el registro del referido.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Subcomponentes
function StatCard({
  label,
  value,
  color = '#ffffff',
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div style={statCardStyle}>
      <p style={statLabelStyle}>{label}</p>
      <p style={{ ...statValueStyle, color }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pendiente', color: '#ffb800', bg: 'rgba(255, 184, 0, 0.1)' },
    qualified: { label: 'Cualificado', color: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)' },
    paid: { label: 'Pagado', color: '#23e7ff', bg: 'rgba(35, 231, 255, 0.1)' },
  };
  const config = map[status] || map.pending;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: config.color,
        background: config.bg,
      }}
    >
      {config.label}
    </span>
  );
}

// Estilos
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0b0b0b',
  color: '#ffffff',
  fontFamily: 'Montserrat, sans-serif',
  padding: '40px 20px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '500px',
  background: '#151518',
  border: '1px solid rgba(35, 231, 255, 0.2)',
  borderRadius: '20px',
  padding: '40px 30px',
  textAlign: 'center',
};

const iconStyle: React.CSSProperties = { fontSize: '3rem', marginBottom: '20px' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#ffffff' };
const descStyle: React.CSSProperties = { color: '#a1a1a6', fontSize: '1rem', marginBottom: '20px', lineHeight: 1.6 };
const subtextStyle: React.CSSProperties = { color: '#a1a1a6', fontSize: '0.95rem', marginTop: '15px' };

const requirementStyle: React.CSSProperties = {
  margin: '20px 0',
  padding: '20px',
  background: 'rgba(35, 231, 255, 0.05)',
  border: '1px solid rgba(35, 231, 255, 0.2)',
  borderRadius: '12px',
};

const buttonStyle: React.CSSProperties = {
  marginTop: '25px',
  background: 'linear-gradient(135deg, #23e7ff 0%, #00b8cc 100%)',
  color: '#0b0b0b',
  border: 'none',
  borderRadius: '12px',
  padding: '15px 40px',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const dashboardContainerStyle: React.CSSProperties = { width: '100%', maxWidth: '900px' };

const dashboardHeaderStyle: React.CSSProperties = { textAlign: 'center', marginBottom: '40px' };
const dashboardTitleStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 700, marginBottom: '10px', color: '#ffffff' };
const dashboardSubtitleStyle: React.CSSProperties = { color: '#a1a1a6', fontSize: '1rem' };

const linkCardStyle: React.CSSProperties = {
  background: '#151518',
  border: '1px solid rgba(35, 231, 255, 0.3)',
  borderRadius: '16px',
  padding: '30px',
  marginBottom: '30px',
};

const linkLabelStyle: React.CSSProperties = {
  color: '#a1a1a6',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '15px',
};

const linkBoxStyle: React.CSSProperties = {
  background: '#0b0b0b',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  padding: '15px',
  marginBottom: '15px',
  overflow: 'auto',
};

const linkTextStyle: React.CSSProperties = {
  color: '#23e7ff',
  fontSize: '0.85rem',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
};

const copyButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #23e7ff 0%, #00b8cc 100%)',
  color: '#0b0b0b',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 30px',
  fontSize: '0.95rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '15px',
  marginBottom: '30px',
};

const statCardStyle: React.CSSProperties = {
  background: '#151518',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center',
};

const statLabelStyle: React.CSSProperties = {
  color: '#a1a1a6',
  fontSize: '0.8rem',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const statValueStyle: React.CSSProperties = { fontSize: '1.8rem', fontWeight: 700 };

const tableContainerStyle: React.CSSProperties = {
  background: '#151518',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '30px',
  marginBottom: '30px',
};

const sectionTitleStyle: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#ffffff' };

const emptyStateStyle: React.CSSProperties = { color: '#a1a1a6', textAlign: 'center', padding: '20px' };

const tableWrapperStyle: React.CSSProperties = { overflowX: 'auto' };

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px',
  color: '#a1a1a6',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const trStyle: React.CSSProperties = { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' };

const tdStyle: React.CSSProperties = { padding: '15px 12px', color: '#ffffff', fontSize: '0.9rem' };

const howItWorksStyle: React.CSSProperties = {
  background: '#151518',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '30px',
};

const howListStyle: React.CSSProperties = {
  paddingLeft: '20px',
  color: '#a1a1a6',
  lineHeight: 1.8,
};

const howItemStyle: React.CSSProperties = { marginBottom: '12px', fontSize: '0.95rem' };
