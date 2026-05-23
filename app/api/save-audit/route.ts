import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { userInput, auditResult, totalSavings } = await request.json();
    
    // Generate unique share ID
    const shareId = randomBytes(8).toString('hex');
    
    console.log('Saving audit with shareId:', shareId);
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('audits')
      .insert({
        share_id: shareId,
        user_input: userInput,
        audit_result: auditResult,
        total_savings: totalSavings,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      shareId: shareId,
      auditId: data.id 
    });
    
  } catch (error) {
    console.error('Save audit error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save audit' 
    }, { status: 500 });
  }
}