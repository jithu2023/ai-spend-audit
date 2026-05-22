import { UserInput, AuditRecommendation, ToolSubscription, AITool, ToolPlan } from '@/types';

// Pricing data (from PRICING_DATA.md)
const PRICING: Record<string, Record<string, number>> = {
  cursor: { hobby: 0, pro: 20, business: 40 },
  'github-copilot': { individual: 10, business: 19, enterprise: 39 },
  claude: { free: 0, pro: 20, max: 30, team: 25 },
  chatgpt: { plus: 20, team: 25 },
  gemini: { pro: 20, ultra: 30 },
  windsurf: { pro: 15, team: 30 },
  'anthropic-api': { paygo: 0 },
  'openai-api': { paygo: 0 },
};

// Alternative suggestions based on use case
const ALTERNATIVES: Record<string, Record<string, { tool: AITool; plan: ToolPlan; savings: number; reason: string }[]>> = {
  coding: {
    cursor: [
      { tool: 'github-copilot', plan: 'individual', savings: 10, reason: 'GitHub Copilot provides similar AI coding assistance for half the price' }
    ],
    windsurf: [
      { tool: 'github-copilot', plan: 'individual', savings: 5, reason: 'GitHub Copilot is more established and costs less for individual developers' }
    ]
  },
  writing: {
    chatgpt: [
      { tool: 'claude', plan: 'pro', savings: 0, reason: 'Claude Pro offers similar writing capabilities at the same price point' }
    ],
    'github-copilot': [
      { tool: 'chatgpt', plan: 'plus', savings: 10, reason: 'ChatGPT is better suited for writing/content creation than Copilot' }
    ]
  },
  data: {
    chatgpt: [
      { tool: 'claude', plan: 'pro', savings: 0, reason: 'Claude Pro offers strong data analysis capabilities' }
    ]
  },
  research: {
    gemini: [
      { tool: 'claude', plan: 'pro', savings: 0, reason: 'Claude Pro has a larger context window for research' }
    ]
  }
};

export function auditSpend(input: UserInput): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = [];
  const activeTools = new Set(input.subscriptions.map(s => s.tool));
  
  for (const sub of input.subscriptions) {
    // Rule 1: Team plan for solo user or small team
    if ((sub.plan === 'team' || sub.plan === 'business') && input.teamSize === 1) {
      const proPrice = getPricing(sub.tool, 'pro');
      if (proPrice > 0 && sub.monthlySpend > proPrice) {
        recommendations.push({
          tool: sub.tool,
          currentPlan: sub.plan,
          currentSpend: sub.monthlySpend,
          recommendedAction: `Downgrade to Pro plan`,
          recommendedPlan: 'pro',
          monthlySavings: sub.monthlySpend - proPrice,
          reason: `${sub.tool.charAt(0).toUpperCase() + sub.tool.slice(1)} ${sub.plan} plan costs $${sub.monthlySpend}/month. As a solo user, the Pro plan at $${proPrice}/month gives you the same features.`
        });
      }
    }
    
    // Rule 1b: Team plan for small teams (2-4 users) - might still be overkill
    if ((sub.plan === 'team' || sub.plan === 'business') && input.teamSize >= 2 && input.teamSize <= 4) {
      const individualTotal = getPricing(sub.tool, 'pro') * input.teamSize;
      if (individualTotal > 0 && sub.monthlySpend > individualTotal) {
        recommendations.push({
          tool: sub.tool,
          currentPlan: sub.plan,
          currentSpend: sub.monthlySpend,
          recommendedAction: `Consider individual Pro plans instead of ${sub.plan}`,
          monthlySavings: sub.monthlySpend - individualTotal,
          reason: `For a team of ${input.teamSize}, buying individual Pro plans at $${getPricing(sub.tool, 'pro')}/each would cost $${individualTotal}/month vs your current $${sub.monthlySpend}/month for the ${sub.plan} plan.`
        });
      }
    }
    
    // Rule 2: Suggest alternatives based on use case
    const alternatives = ALTERNATIVES[input.primaryUseCase]?.[sub.tool];
    if (alternatives) {
      for (const alt of alternatives) {
        // Don't suggest a tool they're already using
        if (!activeTools.has(alt.tool)) {
          const altPrice = getPricing(alt.tool, alt.plan);
          const savings = sub.monthlySpend - altPrice;
          if (savings > 0) {
            recommendations.push({
              tool: sub.tool,
              currentPlan: sub.plan,
              currentSpend: sub.monthlySpend,
              recommendedAction: `Switch to ${alt.tool} ${alt.plan}`,
              recommendedTool: alt.tool,
              recommendedPlan: alt.plan,
              monthlySavings: savings,
              reason: alt.reason
            });
            break; // Only suggest the best alternative
          }
        }
      }
    }
    
    // Rule 3: Duplicate tool detection (using both similar tools)
    if (sub.tool === 'cursor' && activeTools.has('github-copilot')) {
      recommendations.push({
        tool: sub.tool,
        currentPlan: sub.plan,
        currentSpend: sub.monthlySpend,
        recommendedAction: `Consider dropping one coding assistant`,
        monthlySavings: Math.min(sub.monthlySpend, getSubscriptionPrice('github-copilot', input.subscriptions)) * 0.5,
        reason: `You're paying for both Cursor AND GitHub Copilot. Most developers only need one AI coding assistant. Pick the one you prefer and cancel the other, saving about 50% of the cost.`
      });
    }
    
    if ((sub.tool === 'chatgpt' && activeTools.has('claude')) || 
        (sub.tool === 'claude' && activeTools.has('chatgpt'))) {
      const cheaperPrice = Math.min(
        getSubscriptionPrice('chatgpt', input.subscriptions),
        getSubscriptionPrice('claude', input.subscriptions)
      );
      recommendations.push({
        tool: sub.tool,
        currentPlan: sub.plan,
        currentSpend: sub.monthlySpend,
        recommendedAction: `Evaluate if you need both ChatGPT and Claude`,
        monthlySavings: cheaperPrice * 0.5,
        reason: `You're paying for both ChatGPT and Claude ($${getSubscriptionPrice('chatgpt', input.subscriptions)} + $${getSubscriptionPrice('claude', input.subscriptions)}). They have similar capabilities. Consider choosing one primary tool.`
      });
    }
    
    // Rule 4: API vs Subscription analysis
    if (sub.tool === 'anthropic-api' || sub.tool === 'openai-api') {
      const subscriptionCost = 20; // Pro plan cost
      if (sub.monthlySpend > subscriptionCost * 1.5) {
        recommendations.push({
          tool: sub.tool,
          currentPlan: sub.plan,
          currentSpend: sub.monthlySpend,
          recommendedAction: `Switch to Pro subscription`,
          recommendedTool: sub.tool === 'anthropic-api' ? 'claude' : 'chatgpt',
          recommendedPlan: 'pro',
          monthlySavings: sub.monthlySpend - subscriptionCost,
          reason: `You're spending $${sub.monthlySpend}/month on API calls. A Pro subscription at $${subscriptionCost}/month would be significantly cheaper for your usage level.`
        });
      }
    }
    
   // Rule 5: Enterprise plan overkill for small teams
if (sub.plan === 'enterprise' && input.teamSize < 10) {
  const businessPrice = getPricing(sub.tool, 'business');
  const proPrice = getPricing(sub.tool, 'pro');
  
  // Prefer Business plan for teams 5-9, Pro for smaller
  let recommendedPlan: ToolPlan = 'business';
  let recommendedPrice = businessPrice;
  
  if (input.teamSize <= 3 && proPrice > 0) {
    recommendedPlan = 'pro';
    recommendedPrice = proPrice;
  }
  
  if (recommendedPrice > 0 && sub.monthlySpend > recommendedPrice * input.teamSize) {
    recommendations.push({
      tool: sub.tool,
      currentPlan: sub.plan,
      currentSpend: sub.monthlySpend,
      recommendedAction: `Downgrade to ${recommendedPlan === 'pro' ? 'Pro' : 'Business'} plan`,
      recommendedPlan: recommendedPlan,
      monthlySavings: sub.monthlySpend - (recommendedPrice * input.teamSize),
      reason: `Enterprise plans are designed for 10+ users. Your team of ${input.teamSize} would save significantly on ${recommendedPlan === 'pro' ? 'Pro' : 'Business'} plans at $${recommendedPrice}/user/month.`
    });
  }
}
    
    // Rule 6: Spending more than typical benchmark
    const benchmarks: Record<string, number> = {
      coding: 30,
      writing: 20,
      data: 40,
      research: 35,
      mixed: 30
    };
    
    const expectedSpend = benchmarks[input.primaryUseCase] * input.teamSize;
    const totalSpend = input.subscriptions.reduce((sum, s) => sum + s.monthlySpend, 0);
    
    if (totalSpend > expectedSpend * 1.5 && recommendations.length === 0) {
      recommendations.push({
        tool: sub.tool,
        currentPlan: sub.plan,
        currentSpend: sub.monthlySpend,
        recommendedAction: `Review your AI tool usage`,
        monthlySavings: totalSpend - expectedSpend,
        reason: `Companies with ${input.primaryUseCase} as primary use case typically spend $${expectedSpend}/month for ${input.teamSize} user(s). Your total spend of $${totalSpend} is above average.`
      });
    }
  }
  
  // Remove duplicate recommendations (same tool recommended twice)
  const seen = new Set();
  return recommendations.filter(rec => {
    const key = `${rec.tool}-${rec.recommendedAction}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPricing(tool: AITool, plan: string): number {
  return PRICING[tool]?.[plan] || 0;
}

function getSubscriptionPrice(tool: AITool, subscriptions: ToolSubscription[]): number {
  const sub = subscriptions.find(s => s.tool === tool);
  return sub?.monthlySpend || 0;
}

export function calculateTotalSavings(recommendations: AuditRecommendation[]): {
  monthly: number;
  annual: number;
} {
  const monthly = recommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  return { monthly, annual: monthly * 12 };
}

export function isHighSavings(monthlySavings: number): boolean {
  return monthlySavings > 500;
}

export function isOptimal(monthlySavings: number): boolean {
  return monthlySavings < 100;
}