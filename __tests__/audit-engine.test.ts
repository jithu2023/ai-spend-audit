import { describe, it, expect, vi } from 'vitest';
import { auditSpend, calculateTotalSavings, isHighSavings, isOptimal } from '../lib/audit-engine';
import { UserInput } from '../types';

describe('Audit Engine', () => {
  it('detects team plan with 1 seat as overspending', () => {
    const input: UserInput = {
      subscriptions: [{
        tool: 'claude',
        plan: 'team',
        monthlySpend: 25,
      }],
      teamSize: 1,
      primaryUseCase: 'coding'
    };
    
    const results = auditSpend(input);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].monthlySavings).toBeGreaterThan(0);
  });

  it('suggests GitHub Copilot for Cursor users coding', () => {
    const input: UserInput = {
      subscriptions: [{
        tool: 'cursor',
        plan: 'pro',
        monthlySpend: 40,
      }],
      teamSize: 2,
      primaryUseCase: 'coding'
    };
    
    const results = auditSpend(input);
    const hasCopilotSuggestion = results.some(r => r.recommendedTool === 'github-copilot');
    expect(hasCopilotSuggestion).toBe(true);
  });

  it('calculates total savings correctly', () => {
    const mockRecommendations = [
      { monthlySavings: 50, tool: 'cursor', currentPlan: 'pro', currentSpend: 40, recommendedAction: 'test', reason: 'test' },
      { monthlySavings: 30, tool: 'claude', currentPlan: 'team', currentSpend: 25, recommendedAction: 'test', reason: 'test' }
    ];
    
    const { monthly, annual } = calculateTotalSavings(mockRecommendations as any);
    expect(monthly).toBe(80);
    expect(annual).toBe(960);
  });

  it('identifies high savings (>$500)', () => {
    expect(isHighSavings(600)).toBe(true);
    expect(isHighSavings(500)).toBe(false);
    expect(isHighSavings(100)).toBe(false);
  });

  it('identifies optimal spending (<$100 savings possible)', () => {
    expect(isOptimal(50)).toBe(true);
    expect(isOptimal(99)).toBe(true);
    expect(isOptimal(100)).toBe(false);
    expect(isOptimal(200)).toBe(false);
  });

  it('returns empty array when no savings found', () => {
    const input: UserInput = {
      subscriptions: [{
        tool: 'github-copilot',
        plan: 'individual',
        monthlySpend: 10,
      }],
      teamSize: 1,
      primaryUseCase: 'coding'
    };
    
    const results = auditSpend(input);
    expect(results.length).toBe(0);
  });
});