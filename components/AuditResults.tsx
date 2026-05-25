'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuditResult } from '@/types';
import { TrendingDown, CheckCircle, Copy, Share2, Mail, Sparkles, FileText } from 'lucide-react';
import { PDFDownloadButton } from './PDFReport';

interface AuditResultsProps {
  result: AuditResult;
}

export function AuditResults({ result }: AuditResultsProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [shareId, setShareId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [userInputForPDF, setUserInputForPDF] = useState<any>(null);

  const { recommendations, totalMonthlySavings, totalAnnualSavings, isHighSavings, isOptimal } = result;

  // Load user input for PDF
  useEffect(() => {
    const savedForm = localStorage.getItem('ai-audit-form');
    if (savedForm) {
      setUserInputForPDF(JSON.parse(savedForm));
    }
  }, []);

  // Calculate total current spend and optimization score
  const totalCurrentSpend = recommendations.reduce((sum, rec) => sum + rec.currentSpend, 0) || 1;
  const wastePercentage = (totalMonthlySavings / (totalCurrentSpend + totalMonthlySavings)) * 100;
  const optimizationScore = Math.max(0, Math.min(100, 100 - wastePercentage));

  const getScoreConfig = () => {
    if (optimizationScore >= 85) {
      return { color: 'bg-green-600', text: 'text-green-600', message: '🎉 Excellent! You\'re an AI spending pro!', emoji: '🏆' };
    } else if (optimizationScore >= 70) {
      return { color: 'bg-emerald-500', text: 'text-emerald-500', message: '👍 Good job! Small optimizations available.', emoji: '📈' };
    } else if (optimizationScore >= 50) {
      return { color: 'bg-yellow-500', text: 'text-yellow-500', message: '💡 Room for improvement! Check recommendations.', emoji: '🔍' };
    } else {
      return { color: 'bg-red-500', text: 'text-red-500', message: '⚠️ Significant savings available! Take action now.', emoji: '🚨' };
    }
  };

  const scoreConfig = getScoreConfig();

  // Save audit to Supabase backend
  useEffect(() => {
    const saveAuditToBackend = async () => {
      if (isSaving) return;
      setIsSaving(true);
      
      try {
        const savedForm = localStorage.getItem('ai-audit-form');
        let userInput = {};
        
        if (savedForm) {
          userInput = JSON.parse(savedForm);
        }
        
        const response = await fetch('/api/save-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput: userInput,
            auditResult: {
              recommendations: recommendations,
              totalMonthlySavings: totalMonthlySavings,
              totalAnnualSavings: totalAnnualSavings,
              isHighSavings: isHighSavings,
              isOptimal: isOptimal,
            },
            totalSavings: totalMonthlySavings
          })
        });
        
        const data = await response.json();
        if (data.success) {
          console.log('✅ Audit saved! Share ID:', data.shareId);
          setShareId(data.shareId);
          localStorage.setItem('lastAuditShareId', data.shareId);
          localStorage.setItem('lastAuditId', data.auditId);
        }
      } catch (error) {
        console.error('Failed to save audit:', error);
      } finally {
        setIsSaving(false);
      }
    };
    
    saveAuditToBackend();
  }, [recommendations, totalMonthlySavings, totalAnnualSavings, isHighSavings, isOptimal]);

  // Generate AI summary from API
  useEffect(() => {
    const generateSummary = async () => {
      setIsLoadingSummary(true);
      
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recommendations: recommendations,
            totalMonthlySavings: totalMonthlySavings,
            totalAnnualSavings: totalAnnualSavings,
            primaryUseCase: userInputForPDF?.primaryUseCase || 'coding',
          })
        });
        
        const data = await response.json();
        setAiSummary(data.summary);
      } catch (error) {
        console.error('Failed to generate AI summary:', error);
        const fallbackSummary = `Based on your AI tool usage, we found ${recommendations.length} way(s) to optimize your spending. ${totalMonthlySavings > 0 ? `You could save $${totalMonthlySavings}/month by following our recommendations below.` : 'Your spending looks optimized!'} ${isHighSavings ? 'Contact Credex to capture these savings through discounted AI credits.' : ''}`;
        setAiSummary(fallbackSummary);
      } finally {
        setIsLoadingSummary(false);
      }
    };
    
    generateSummary();
  }, [recommendations, totalMonthlySavings, totalAnnualSavings, isHighSavings, userInputForPDF]);

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const auditId = localStorage.getItem('lastAuditId');
    
    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          auditId: auditId,
          totalSavings: totalMonthlySavings,
          isHighSavings: isHighSavings,
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Lead captured:', data.leadId);
        
        const leadData = {
          email,
          companyName,
          role,
          auditResult: {
            totalMonthlySavings,
            totalAnnualSavings,
            recommendations: recommendations.length,
            isHighSavings,
          },
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(`lead-${email}`, JSON.stringify(leadData));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setEmail('');
        setCompanyName('');
        setRole('');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
      alert('Failed to save. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className={`border-2 ${isHighSavings ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' : isOptimal ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50' : 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50'}`}>
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">
            {isOptimal ? "💪" : isHighSavings ? "🎉" : "🔍"}
          </div>
          <CardTitle className="text-3xl">
            {isOptimal ? "You're spending well!" : isHighSavings ? "Big savings opportunity!" : "Optimization opportunities found"}
          </CardTitle>
          <CardDescription className="text-base">
            Based on your AI tool usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-muted-foreground text-sm">Monthly Savings Potential</p>
              <p className="text-4xl font-bold text-green-600">
                ${totalMonthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-muted-foreground text-sm">Annual Savings Potential</p>
              <p className="text-4xl font-bold text-green-600">
                ${totalAnnualSavings.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Optimization Score Card */}
          <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">AI Spend Optimization Score</span>
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
              <p className="font-semibold text-lg">🎯 Credex can help you capture these savings</p>
              <p className="text-sm mt-1">Get discounted AI credits from companies that overforecasted</p>
              <Button className="mt-3 bg-green-600 hover:bg-green-700">
                Book a Free Consultation →
              </Button>
            </div>
          )}
          
          {isOptimal && (
            <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
              <p className="text-sm">📧 Get notified when new optimizations apply to your stack</p>
              <Button className="mt-2" variant="outline">
                Notify Me of New Savings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI-Powered Summary */}
      <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">AI-Powered Summary</CardTitle>
          </div>
          <CardDescription>Personalized insights based on your audit</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSummary ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse text-muted-foreground">Generating insights...</div>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {aiSummary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Per-Tool Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>Per-tool analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold">No savings found!</p>
              <p className="text-muted-foreground">Your AI tool spending looks optimized already.</p>
            </div>
          ) : (
            recommendations.map((rec, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {rec.tool.replace('-', ' ')}
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

      {/* Email Capture Section */}
      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <CardTitle>Get Your Full Report</CardTitle>
            </div>
            <CardDescription>
              Enter your email to save this audit and get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Your Role (Optional)</Label>
                  <Input
                    id="role"
                    type="text"
                    placeholder="CTO, Founder, etc."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save My Report →'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We'll save your audit and send you a copy. No spam, unsubscribe anytime.
              </p>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <CardTitle className="text-lg">Report Saved!</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your audit has been saved. Check your email for a copy.
            </p>
          </CardContent>
        </Card>
      )}

      {/* PDF Export Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            <CardTitle>Download Report</CardTitle>
          </div>
          <CardDescription>
            Get a professional PDF report of your audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PDFDownloadButton
            result={{
              totalMonthlySavings,
              totalAnnualSavings,
              recommendations,
              isHighSavings,
              isOptimal,
            }}
            userInput={{
              teamSize: userInputForPDF?.teamSize || 1,
              primaryUseCase: userInputForPDF?.primaryUseCase || 'coding',
            }}
          />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Professional report with all recommendations and savings calculations
          </p>
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Results</CardTitle>
          <CardDescription>Share this audit with your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={handleCopyLink} className="gap-2" disabled={!shareId}>
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : shareId ? 'Copy Shareable Link' : 'Generating link...'}
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          {shareId && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              Share link: {typeof window !== 'undefined' ? `${window.location.origin}/share/${shareId}` : ''}
            </p>
          )}
          <p className="text-xs text-center text-muted-foreground mt-2">
            Your personal information is not included in shared links
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground">
        *Savings estimates based on current pricing. Actual savings may vary. Always verify current prices before making changes.
      </p>
    </div>
  );
}