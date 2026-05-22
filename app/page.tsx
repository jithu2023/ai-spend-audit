'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolForm } from '@/components/ToolForm';
import { AuditResults } from '@/components/AuditResults';
import { UserInput, AuditResult, ToolSubscription } from '@/types';
import { auditSpend, calculateTotalSavings, isHighSavings, isOptimal } from '@/lib/audit-engine';

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastUserInput, setLastUserInput] = useState<UserInput | null>(null);

  const handleAudit = (input: UserInput) => {
    const recommendations = auditSpend(input);
    const { monthly, annual } = calculateTotalSavings(recommendations);
    
    const result: AuditResult = {
      id: crypto.randomUUID(),
      recommendations,
      totalMonthlySavings: monthly,
      totalAnnualSavings: annual,
      isHighSavings: isHighSavings(monthly),
      isOptimal: isOptimal(monthly),
      createdAt: new Date(),
    };
    
    setLastUserInput(input);
    setAuditResult(result);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowResults(false);
    // Don't clear lastUserInput - keep it to restore form
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            AI Spend Audit
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover how much you're overspending on AI tools — and how to fix it
          </p>
        </div>

        {/* Main Content */}
        {!showResults ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Tell us about your AI stack</CardTitle>
              <CardDescription>
                Add the AI tools your team uses, and we'll analyze your spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToolForm onSubmit={handleAudit} initialData={lastUserInput} />
            </CardContent>
          </Card>
        ) : (
          auditResult && (
            <>
              <div className="mb-4">
                <Button variant="ghost" onClick={handleBack} className="mb-4">
                  ← Back to form
                </Button>
              </div>
              <AuditResults result={auditResult} />
            </>
          )
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>Powered by Credex — Get discounted AI credits from companies that overforecast</p>
        </footer>
      </div>
    </main>
  );
}