// AI Tool definitions
export type AITool = 
  | 'cursor' 
  | 'github-copilot' 
  | 'claude' 
  | 'chatgpt' 
  | 'gemini' 
  | 'anthropic-api' 
  | 'openai-api' 
  | 'windsurf';

export type ToolPlan = 
  | 'free' 
  | 'pro' 
  | 'business' 
  | 'enterprise' 
  | 'team' 
  | 'max' 
  | 'ultra'
  | 'individual'
  | 'paygo'
  | 'plus'
  | 'hobby';

export interface ToolSubscription {
  tool: AITool;
  plan: ToolPlan;
  monthlySpend: number;
  // seats removed - simplified
}

export interface UserInput {
  subscriptions: ToolSubscription[];
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

export interface AuditRecommendation {
  tool: AITool;
  currentPlan: ToolPlan;
  currentSpend: number;
  recommendedAction: string;
  recommendedTool?: AITool;
  recommendedPlan?: ToolPlan;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isOptimal: boolean;
  llmSummary?: string;
  createdAt: Date;
}