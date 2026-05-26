'use client';

import { useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolForm } from '@/components/ToolForm';
import { AuditResults } from '@/components/AuditResults';
import { UserInput, AuditResult } from '@/types';
import { auditSpend, calculateTotalSavings, isHighSavings, isOptimal } from '@/lib/audit-engine';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

// Loading component for suspense
function LoadingSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="h-7 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastUserInput, setLastUserInput] = useState<UserInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAudit = async (input: UserInput) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowResults(false);
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[600px]">
        
        {/* Enhanced Header with Stats - added min-height to prevent CLS */}
        <div className="text-center mb-10 min-h-[180px]">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Free AI Spend Audit</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Spend Audit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover hidden savings in your AI tool stack. Save up to 40% on Cursor, ChatGPT, Claude, and more.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>Real-time pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>2-minute audit</span>
            </div>
          </div>
        </div>

        {/* Main Content with Suspense for better loading UX */}
        <Suspense fallback={<LoadingSkeleton />}>
          {!showResults ? (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="text-center border-b pb-6">
                <CardTitle className="text-2xl">Tell us about your AI stack</CardTitle>
                <CardDescription className="text-base">
                  Add the AI tools your team uses, and we'll analyze your spending
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-muted-foreground">Analyzing your AI spend...</p>
                  </div>
                ) : (
                  <ToolForm onSubmit={handleAudit} initialData={lastUserInput} />
                )}
              </CardContent>
            </Card>
          ) : (
            auditResult && (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    ← Back to form
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Audit ID: {auditResult.id.slice(0, 8)}...
                  </div>
                </div>
                <AuditResults result={auditResult} />
              </>
            )
          )}
        </Suspense>

        {/* Footer with social proof */}
        <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <div className="flex flex-col gap-2">
            <p className="flex items-center justify-center gap-1">
              <span>🔍</span> Trusted by 500+ startups
            </p>
            <p>
              Powered by <span className="font-semibold text-blue-600">Credex</span> — Get discounted AI credits from companies that overforecast
            </p>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}