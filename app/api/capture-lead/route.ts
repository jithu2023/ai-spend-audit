import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, companyName, role, auditId, totalSavings, isHighSavings } = await request.json();
    
    // Basic validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    console.log('Capturing lead:', email);
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert({
        email,
        company_name: companyName || null,
        role: role || null,
        audit_id: auditId,
        total_savings: totalSavings || 0,
        is_high_savings: isHighSavings || false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, leadId: data.id });
    
  } catch (error) {
    console.error('Capture lead error:', error);
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}