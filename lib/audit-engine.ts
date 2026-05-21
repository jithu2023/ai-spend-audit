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

// Monthly cost limits for what's considered "reasonable"
const REASONABLE_MONTHLY_PER_USER: Record<string, number> = {
  coding: 30,
  writing: 20,
  data: 50,
  research: 40,
  mixed: 35,
};

export function auditSpend(input: UserInput): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = [];
  
  for (const sub of input.subscriptions) {
    const rec = evaluateSubscription(sub, input);
    if (rec && rec.monthlySavings > 0) {
      recommendations.push(rec);
    }
  }
  
  return recommendations;
}

function evaluateSubscription(
  sub: ToolSubscription, 
  input: UserInput
): AuditRecommendation | null {
  // Rule 1: Check if paying for Team/Business plan with 1 user
  if ((sub.plan === 'team' || sub.plan === 'business') && sub.seats === 1) {
    const proPrice = getPricing(sub.tool, 'pro');
    if (proPrice > 0) {
      return {
        tool: sub.tool,
        currentPlan: sub.plan,
        currentSpend: sub.monthlySpend,
        recommendedAction: `Downgrade to Pro plan`,
        recommendedPlan: 'pro',
        monthlySavings: sub.monthlySpend - (proPrice * sub.seats),
        reason: `You're paying for a ${sub.plan} plan but only have ${sub.seats} user. The Pro plan gives the same features for individuals and costs $${proPrice}/month.`
      };
    }
  }

  // Rule 2: Check for cheaper alternatives based on use case
  if (sub.tool === 'cursor' && input.primaryUseCase === 'coding') {
    const copilotPrice = getPricing('github-copilot', 'individual');
    if (copilotPrice > 0 && sub.monthlySpend > copilotPrice * sub.seats) {
      return {
        tool: sub.tool,
        currentPlan: sub.plan,
        currentSpend: sub.monthlySpend,
        recommendedAction: `Switch to GitHub Copilot Individual`,
        recommendedTool: 'github-copilot',
        recommendedPlan: 'individual',
        monthlySavings: sub.monthlySpend - (copilotPrice * sub.seats),
        reason: `For coding assistance, GitHub Copilot costs $${copilotPrice}/user/month vs Cursor's $${getPricing('cursor', 'pro') || 20}+. Most developers don't need Cursor's advanced IDE features.`
      };
    }
  }

  // Rule 3: Check if spending above reasonable limit for use case
  const reasonableLimit = REASONABLE_MONTHLY_PER_USER[input.primaryUseCase] * sub.seats;
  if (sub.monthlySpend > reasonableLimit * 1.5) {
    return {
      tool: sub.tool,
      currentPlan: sub.plan,
      currentSpend: sub.monthlySpend,
      recommendedAction: `Review usage and consider downgrading`,
      monthlySavings: sub.monthlySpend - reasonableLimit,
      reason: `Companies with ${input.primaryUseCase} as primary use case typically spend $${reasonableLimit}/month for ${sub.seats} user(s). You're spending $${sub.monthlySpend} - there's likely room to optimize.`
    };
  }
  
  return null;
}

function getPricing(tool: AITool, plan: string): number {
  return PRICING[tool]?.[plan] || 0;
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