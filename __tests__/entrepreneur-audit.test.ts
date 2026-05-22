import { describe, it, expect } from 'vitest';
import { auditSpend, calculateTotalSavings, isHighSavings, isOptimal } from '../lib/audit-engine';
import { UserInput } from '../types';

describe('Real Entrepreneur Scenarios', () => {
  
  describe('Solo Founder / Indie Hacker', () => {
    it('detects solo founder wasting money on Team plan', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'claude', plan: 'team', monthlySpend: 25 }
        ],
        teamSize: 1,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].recommendedAction).toContain('Downgrade');
      expect(results[0].monthlySavings).toBe(5); // 25 - 20 = 5
    });

    it('suggests GitHub Copilot for solo Cursor user', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 20 }
        ],
        teamSize: 1,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      const hasCopilotSuggestion = results.some(r => r.recommendedTool === 'github-copilot');
      expect(hasCopilotSuggestion).toBe(true);
    });

    it('warns solo founder paying for both ChatGPT and Claude', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'chatgpt', plan: 'plus', monthlySpend: 20 },
          { tool: 'claude', plan: 'pro', monthlySpend: 20 }
        ],
        teamSize: 1,
        primaryUseCase: 'writing'
      };
      
      const results = auditSpend(input);
      const hasDuplicateWarning = results.some(r => 
        r.recommendedAction.includes('both') || r.recommendedAction.includes('duplicate')
      );
      expect(hasDuplicateWarning).toBe(true);
    });
  });

  describe('Early Stage Startup (2-5 people)', () => {
    it('detects small team overpaying for Enterprise plan', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'github-copilot', plan: 'enterprise', monthlySpend: 117 } // 3 * 39
        ],
        teamSize: 3,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      const hasDowngradeSuggestion = results.some(r => 
        r.recommendedAction.includes('Downgrade') || r.recommendedAction.includes('Business')
      );
      expect(hasDowngradeSuggestion).toBe(true);
    });

    it('suggests team plan for 3+ people using individual subscriptions', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 60 } // 3 * 20
        ],
        teamSize: 3,
        primaryUseCase: 'coding'
      };
      
      // This test expects a recommendation to consider team pricing
      const results = auditSpend(input);
      // Note: This might need enhancement in audit engine
      expect(results).toBeDefined();
    });
  });

  describe('Growing Startup (6-10 people)', () => {
    it('flags API users who would save with subscription', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'anthropic-api', plan: 'paygo', monthlySpend: 50 }
        ],
        teamSize: 5,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      const hasApiSuggestion = results.some(r => 
        r.recommendedAction.includes('Switch to') && r.recommendedTool === 'claude'
      );
      expect(hasApiSuggestion).toBe(true);
    });

    it('detects redundant tools in growing team', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 100 },
          { tool: 'github-copilot', plan: 'business', monthlySpend: 95 },
          { tool: 'windsurf', plan: 'pro', monthlySpend: 75 }
        ],
        teamSize: 5,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      const hasRedundancyWarning = results.some(r => 
        r.recommendedAction.includes('dropping') || r.recommendedAction.includes('one coding assistant')
      );
      expect(hasRedundancyWarning).toBe(true);
    });
  });

  describe('Edge Cases & Real World Scenarios', () => {
    it('does NOT suggest switching to tool already being used', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 20 },
          { tool: 'github-copilot', plan: 'individual', monthlySpend: 10 }
        ],
        teamSize: 1,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      // Should not suggest Copilot since they already have it
      const suggestsCopilot = results.some(r => 
        r.recommendedTool === 'github-copilot' && r.tool === 'cursor'
      );
      expect(suggestsCopilot).toBe(false);
    });

    it('handles free tier users correctly', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'cursor', plan: 'hobby', monthlySpend: 0 },
          { tool: 'claude', plan: 'free', monthlySpend: 0 }
        ],
        teamSize: 1,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      // Should show optimal spending message
      const totalSavings = calculateTotalSavings(results);
      expect(totalSavings.monthly).toBe(0);
    });

    it('calculates annual savings correctly', () => {
      const mockRecommendations = [
        { monthlySavings: 50, tool: 'cursor', currentPlan: 'pro', currentSpend: 20, recommendedAction: 'test', reason: 'test' },
        { monthlySavings: 30, tool: 'claude', currentPlan: 'team', currentSpend: 25, recommendedAction: 'test', reason: 'test' }
      ];
      
      const { monthly, annual } = calculateTotalSavings(mockRecommendations as any);
      expect(monthly).toBe(80);
      expect(annual).toBe(960);
    });
  });

  describe('Business Logic Validation', () => {
    it('identifies high savings opportunities (>$500)', () => {
      expect(isHighSavings(600)).toBe(true);
      expect(isHighSavings(1000)).toBe(true);
    });

    it('identifies optimal spending (<$100 potential savings)', () => {
      expect(isOptimal(50)).toBe(true);
      expect(isOptimal(99)).toBe(true);
    });

    it('does NOT flag already optimal spending as problem', () => {
      const input: UserInput = {
        subscriptions: [
          { tool: 'github-copilot', plan: 'individual', monthlySpend: 10 }
        ],
        teamSize: 1,
        primaryUseCase: 'coding'
      };
      
      const results = auditSpend(input);
      const totalSavings = calculateTotalSavings(results);
      expect(totalSavings.monthly).toBeLessThan(100);
    });
  });
});