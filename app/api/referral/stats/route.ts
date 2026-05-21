import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Missing wallet parameter' },
        { status: 400 }
      );
    }

    // Validación básica de formato Solana wallet
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet format' },
        { status: 400 }
      );
    }

    // Traer todos los referidos del referrer
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_wallet', wallet)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allReferrals = referrals || [];

    // Calcular stats
    const stats = {
      total: allReferrals.length,
      pending: allReferrals.filter((r) => r.status === 'pending').length,
      qualified: allReferrals.filter((r) => r.status === 'qualified').length,
      paid: allReferrals.filter((r) => r.status === 'paid').length,
      total_witx_earned: allReferrals
        .filter((r) => r.status === 'qualified' || r.status === 'paid')
        .reduce((sum, r) => sum + (Number(r.reward_witx) || 0), 0),
      pending_witx_claim: allReferrals
        .filter((r) => r.status === 'qualified')
        .reduce((sum, r) => sum + (Number(r.reward_witx) || 0), 0),
    };

    // Formatear lista de referidos para la tabla (wallet abreviada, fecha, status)
    const referralsList = allReferrals.map((r) => ({
      id: r.id,
      referred_wallet: r.referred_wallet,
      referred_wallet_short: `${r.referred_wallet.slice(0, 4)}...${r.referred_wallet.slice(-4)}`,
      created_at: r.created_at,
      status: r.status,
      qualifying_swap_usd: r.qualifying_swap_usd,
      reward_witx: r.reward_witx,
    }));

    return NextResponse.json({
      success: true,
      stats,
      referrals: referralsList,
    });
  } catch (err) {
    console.error('Endpoint error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
