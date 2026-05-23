import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, CheckCircle, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SharePageProps {
  params: Promise<{ id: string }>;
}

// Helper function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function SharePage({ params }: SharePageProps) {
  // Unwrap params for Next.js 15
  const { id } = await params;
  
  console.log('Fetching shared audit with ID:', id);
  
  // Fetch audit from Supabase
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('share_id', id)
    .single();
  
  if (error || !audit) {
    console.error('Share page error:', error);
    notFound();
  }
  
  const auditResult = audit.audit_result;
  const totalMonthlySavings = audit.total_savings || 0;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const recommendations = auditResult?.recommendations || [];
  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = totalMonthlySavings < 100;
  const createdAt = audit.created_at;
  
  // Calculate optimization score
  const totalCurrentSpend = recommendations.reduce((sum: number, rec: any) => sum + (rec.currentSpend || 0), 0) || 1;
  const wastePercentage = (totalMonthlySavings / (totalCurrentSpend + totalMonthlySavings)) * 100;
  const optimizationScore = Math.max(0, Math.min(100, 100 - wastePercentage));
  
  const getScoreConfig = () => {
    if (optimizationScore >= 85) {
      return { color: 'bg-green-600', text: 'text-green-600', message: '🎉 Excellent! AI spending optimized!', border: 'border-green-500' };
    } else if (optimizationScore >= 70) {
      return { color: 'bg-emerald-500', text: 'text-emerald-500', message: '👍 Good! Minor optimizations available.', border: 'border-emerald-500' };
    } else if (optimizationScore >= 50) {
      return { color: 'bg-yellow-500', text: 'text-yellow-500', message: '💡 Room for improvement!', border: 'border-yellow-500' };
    } else {
      return { color: 'bg-red-500', text: 'text-red-500', message: '⚠️ Significant savings available!', border: 'border-red-500' };
    }
  };
  
  const scoreConfig = getScoreConfig();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm mb-4">
            <TrendingUp className="h-4 w-4" />
            <span>Shared Audit Results</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            AI Spend Audit
          </h1>
          <p className="text-lg text-muted-foreground">
            Someone shared their AI spending insights with you
          </p>
          {createdAt && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              Audit conducted on {formatDate(createdAt)}
            </p>
          )}
        </div>

        {/* Hero Section */}
        <Card className={`border-2 ${isHighSavings ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' : isOptimal ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50' : 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50'} mb-6`}>
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">
              {isOptimal ? "💪" : isHighSavings ? "🎉" : "🔍"}
            </div>
            <CardTitle className="text-3xl">
              {isOptimal ? "Optimized Spending!" : isHighSavings ? "Big Savings Opportunity!" : "Optimization Opportunities Found"}
            </CardTitle>
            <CardDescription className="text-base">
              Based on their AI tool usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Monthly Savings Potential
                </p>
                <p className="text-4xl font-bold text-green-600">
                  ${totalMonthlySavings.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Annual Savings Potential
                </p>
                <p className="text-4xl font-bold text-green-600">
                  ${totalAnnualSavings.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Optimization Score Card */}
            <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  AI Spend Optimization Score
                </span>
                <span className={`text-2xl font-bold ${scoreConfig.text}`}>
                  {Math.round(optimizationScore)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`${scoreConfig.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${optimizationScore}%` }}
                />
              </div>
              <p className="text-sm text-center mt-3">
                {scoreConfig.message}
              </p>
            </div>
            
            {isHighSavings && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <p className="font-semibold text-lg">🎯 Credex can help capture these savings</p>
                <p className="text-sm mt-1">Get discounted AI credits from companies that overforecasted</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summary Preview */}
        <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <CardTitle className="text-lg">AI-Powered Summary</CardTitle>
            </div>
            <CardDescription>Personalized insights from their audit</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {auditResult?.llmSummary || 
                `Based on their ${auditResult?.primaryUseCase || 'AI'} workflow, we found ${recommendations.length} way(s) to optimize spending. ${totalMonthlySavings > 0 ? `Potential savings of $${totalMonthlySavings}/month by following the recommendations below.` : 'Their spending looks optimized!'}`}
            </p>
          </CardContent>
        </Card>

        {/* Per-Tool Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>Per-tool analysis and recommendations from their audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-semibold">No savings found!</p>
                <p className="text-muted-foreground">Their AI tool spending looks optimized already.</p>
              </div>
            ) : (
              recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-lg capitalize">
                        {rec.tool?.replace('-', ' ') || 'Unknown Tool'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Current: {rec.currentPlan} plan · ${rec.currentSpend}/month
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Save ${rec.monthlySavings}/month
                    </Badge>
                  </div>
                  
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Recommendation:</strong> {rec.recommendedAction}
                        {rec.recommendedTool && ` (Switch to ${rec.recommendedTool.replace('-', ' ')} ${rec.recommendedPlan})`}
                      </span>
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground pl-6">
                      {rec.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Summary of their AI spending analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{recommendations.length}</p>
                <p className="text-xs text-muted-foreground">Optimizations Found</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">${totalMonthlySavings}</p>
                <p className="text-xs text-muted-foreground">Monthly Savings</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">${totalAnnualSavings}</p>
                <p className="text-xs text-muted-foreground">Annual Savings</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{Math.round(optimizationScore)}%</p>
                <p className="text-xs text-muted-foreground">Optimization Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center border-blue-200 bg-blue-50/30 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle>Want to see your own savings?</CardTitle>
            <CardDescription>
              Run a free audit to discover how much your team could save on AI tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Run Your Free Audit →
              </Button>
            </Link>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">🔍 100% Free</div>
              <div className="flex items-center gap-1">⚡ Takes 2 minutes</div>
              <div className="flex items-center gap-1">💳 No credit card required</div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>Powered by <span className="font-semibold text-blue-600">Credex</span> — Get discounted AI credits from companies that overforecast</p>
        </footer>
      </div>
    </main>
  );
}