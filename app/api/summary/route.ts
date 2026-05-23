import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { recommendations, totalMonthlySavings, primaryUseCase, totalAnnualSavings } = await request.json();
    
    // Generate smart fallback summary (no API key needed)
    const summary = generateSmartSummary(recommendations, totalMonthlySavings, totalAnnualSavings, primaryUseCase);
    
    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json({ 
      summary: "We've analyzed your AI spend and found optimization opportunities. Check your recommendations below to start saving."
    });
  }
}

function generateSmartSummary(recommendations: any[], monthly: number, annual: number, useCase: string): string {
  if (recommendations.length === 0) {
    return `🎉 Great news! Based on your ${useCase} workflow, your AI spending is already optimized. No changes needed right now. Check back monthly as prices change!`;
  }
  
  const topRec = recommendations[0];
  const savingsText = monthly > 0 ? `save $${monthly}/month ($${annual}/year)` : 'optimize your spending';
  
  let summary = `Based on your ${useCase} workflow, you could ${savingsText} by `;
  
  if (topRec.recommendedAction.includes('Downgrade')) {
    summary += `downgrading ${topRec.tool} from ${topRec.currentPlan} to ${topRec.recommendedPlan}. `;
  } else if (topRec.recommendedTool) {
    summary += `switching from ${topRec.tool} to ${topRec.recommendedTool}. `;
  } else {
    summary += `${topRec.recommendedAction.toLowerCase()}. `;
  }
  
  if (recommendations.length > 1) {
    summary += `Plus ${recommendations.length - 1} more optimization${recommendations.length - 1 > 1 ? 's' : ''} to review below.`;
  }
  
  return summary;
}