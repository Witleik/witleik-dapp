import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { referrer_wallet, referred_wallet } = await req.json();

    if (!referrer_wallet || !referred_wallet) {
      return NextResponse.json(
        { error: 'Missing wallet addresses' },
        { status: 400 }
      );
    }

    if (referrer_wallet === referred_wallet) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_wallet', referred_wallet)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Wallet already referred' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_wallet,
        referred_wallet,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Endpoint error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
