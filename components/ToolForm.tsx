'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, RefreshCw } from 'lucide-react';
import { UserInput, ToolSubscription, AITool, ToolPlan } from '@/types';

const TOOLS: { value: AITool; label: string }[] = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'github-copilot', label: 'GitHub Copilot' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'anthropic-api', label: 'Anthropic API' },
  { value: 'openai-api', label: 'OpenAI API' },
  { value: 'windsurf', label: 'Windsurf' },
];

// Complete pricing data for all plans
const PLAN_PRICES: Record<string, number> = {
  'cursor-hobby': 0,
  'cursor-pro': 20,
  'cursor-business': 40,
  'github-copilot-individual': 10,
  'github-copilot-business': 19,
  'github-copilot-enterprise': 39,
  'claude-free': 0,
  'claude-pro': 20,
  'claude-max': 30,
  'claude-team': 25,
  'chatgpt-plus': 20,
  'chatgpt-team': 25,
  'gemini-pro': 20,
  'gemini-ultra': 30,
  'windsurf-pro': 15,
  'windsurf-team': 30,
  'anthropic-api-paygo': 0,
  'openai-api-paygo': 0,
};

const PLANS: Record<AITool, { value: ToolPlan; label: string }[]> = {
  cursor: [
    { value: 'hobby', label: 'Hobby (Free)' },
    { value: 'pro', label: 'Pro ($20/mo)' },
    { value: 'business', label: 'Business ($40/mo)' },
  ],
  'github-copilot': [
    { value: 'individual', label: 'Individual ($10/mo)' },
    { value: 'business', label: 'Business ($19/mo)' },
    { value: 'enterprise', label: 'Enterprise ($39/mo)' },
  ],
  claude: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($20/mo)' },
    { value: 'max', label: 'Max ($30/mo)' },
    { value: 'team', label: 'Team ($25/seat/mo)' },
  ],
  chatgpt: [
    { value: 'plus', label: 'Plus ($20/mo)' },
    { value: 'team', label: 'Team ($25/seat/mo)' },
  ],
  gemini: [
    { value: 'pro', label: 'Pro ($20/mo)' },
    { value: 'ultra', label: 'Ultra ($30/mo)' },
  ],
  'anthropic-api': [
    { value: 'paygo', label: 'Pay-as-you-go' },
  ],
  'openai-api': [
    { value: 'paygo', label: 'Pay-as-you-go' },
  ],
  windsurf: [
    { value: 'pro', label: 'Pro ($15/mo)' },
    { value: 'team', label: 'Team ($30/seat/mo)' },
  ],
};

// Helper function to get plan price
const getPlanPrice = (tool: AITool, plan: ToolPlan): number => {
  return PLAN_PRICES[`${tool}-${plan}`] || 0;
};

// Default subscription
const getDefaultSubscription = (): ToolSubscription => ({
  tool: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
});

interface ToolFormProps {
  onSubmit: (input: UserInput) => void;
  initialData?: UserInput | null;
}

export function ToolForm({ onSubmit, initialData }: ToolFormProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptions, setSubscriptions] = useState<ToolSubscription[]>([getDefaultSubscription()]);
  const [teamSize, setTeamSize] = useState(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<UserInput['primaryUseCase']>('coding');

  // Load saved data from localStorage OR initialData prop
  useEffect(() => {
    if (initialData) {
      setSubscriptions(initialData.subscriptions);
      setTeamSize(initialData.teamSize);
      setPrimaryUseCase(initialData.primaryUseCase);
      setIsLoaded(true);
      return;
    }

    const saved = localStorage.getItem('ai-audit-form');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.subscriptions && data.subscriptions.length > 0) {
          setSubscriptions(data.subscriptions);
          setTeamSize(data.teamSize || 1);
          setPrimaryUseCase(data.primaryUseCase || 'coding');
        }
      } catch (e) {
        console.error('Failed to load saved form', e);
      }
    }
    setIsLoaded(true);
  }, [initialData]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    
    localStorage.setItem('ai-audit-form', JSON.stringify({
      subscriptions,
      teamSize,
      primaryUseCase
    }));
  }, [subscriptions, teamSize, primaryUseCase, isLoaded]);

  const addSubscription = () => {
    setSubscriptions([...subscriptions, getDefaultSubscription()]);
  };

  const removeSubscription = (index: number) => {
    if (subscriptions.length === 1) return;
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  // Auto-calculate monthly spend when tool or plan changes
  const updateSubscription = (index: number, field: keyof ToolSubscription, value: any) => {
    const updated = [...subscriptions];
    updated[index] = { ...updated[index], [field]: value };
    
    // If tool or plan changed, auto-calculate the monthly spend
    if (field === 'tool' || field === 'plan') {
      const currentTool = field === 'tool' ? value : updated[index].tool;
      const currentPlan = field === 'plan' ? value : updated[index].plan;
      const calculatedPrice = getPlanPrice(currentTool as AITool, currentPlan as ToolPlan);
      updated[index].monthlySpend = calculatedPrice;
    }
    
    setSubscriptions(updated);
  };

  // Manual override for monthly spend
  const handleManualSpendChange = (index: number, value: number) => {
    const updated = [...subscriptions];
    updated[index].monthlySpend = value;
    setSubscriptions(updated);
  };

  // Reset to default price for a specific tool
  const resetToDefaultPrice = (index: number) => {
    const updated = [...subscriptions];
    const defaultPrice = getPlanPrice(updated[index].tool, updated[index].plan);
    updated[index].monthlySpend = defaultPrice;
    setSubscriptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate: Check if any monthly spend is 0 but plan isn't free
    const hasError = subscriptions.some(sub => {
      const planPrice = getPlanPrice(sub.tool, sub.plan);
      return sub.monthlySpend === 0 && planPrice > 0;
    });
    
    if (hasError) {
      alert('Some tools have a $0 spend but are on paid plans. Please verify your monthly spend or update the plan.');
      return;
    }
    
    onSubmit({
      subscriptions,
      teamSize,
      primaryUseCase
    });
  };

  // Calculate total monthly spend for display
  const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.monthlySpend, 0);

  if (!isLoaded) {
    return <div className="text-center py-8">Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label>AI Tools You Use</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Total monthly spend: <span className="font-bold text-primary">${totalMonthlySpend}</span>
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSubscription}>
            <Plus className="h-4 w-4 mr-1" /> Add Tool
          </Button>
        </div>
        
        {subscriptions.map((sub, idx) => (
          <Card key={idx} className="relative">
            <CardContent className="pt-4">
              {subscriptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubscription(idx)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Tool</Label>
                  <Select
                    value={sub.tool}
                    onValueChange={(v) => updateSubscription(idx, 'tool', v as AITool)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOLS.map(tool => (
                        <SelectItem key={tool.value} value={tool.value}>
                          {tool.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={sub.plan}
                    onValueChange={(v) => updateSubscription(idx, 'plan', v as ToolPlan)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANS[sub.tool]?.map(plan => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Monthly Spend ($)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      step={5}
                      placeholder="Auto-calculated"
                      value={sub.monthlySpend || ''}
                      onChange={(e) => handleManualSpendChange(idx, parseInt(e.target.value) || 0)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => resetToDefaultPrice(idx)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Reset to plan default price"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: ${getPlanPrice(sub.tool, sub.plan)}/month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Total Team Size</Label>
          <Input
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Total employees at your company
          </p>
        </div>
        
        <div>
          <Label>Primary Use Case</Label>
          <Select value={primaryUseCase} onValueChange={(v) => setPrimaryUseCase(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coding">💻 Coding / Development</SelectItem>
              <SelectItem value="writing">✍️ Writing / Content</SelectItem>
              <SelectItem value="data">📊 Data Analysis</SelectItem>
              <SelectItem value="research">🔬 Research</SelectItem>
              <SelectItem value="mixed">🎯 Mixed / General</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            How your team primarily uses AI tools
          </p>
        </div>
      </div>
      
      <Button type="submit" className="w-full" size="lg">
        Run Audit → Find Savings
      </Button>
    </form>
  );
}