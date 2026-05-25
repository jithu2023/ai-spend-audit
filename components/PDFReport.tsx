'use client';

import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFReportProps {
  result: {
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    recommendations: Array<{
      tool: string;
      currentPlan: string;
      currentSpend: number;
      recommendedAction: string;
      monthlySavings: number;
      reason: string;
    }>;
    isHighSavings: boolean;
    isOptimal: boolean;
  };
  userInput: {
    teamSize: number;
    primaryUseCase: string;
  };
}

export function generatePDF({ result, userInput }: PDFReportProps) {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text('AI Spend Audit Report', 20, yPos);
  yPos += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  // Savings Summary Box
  doc.setFillColor(240, 253, 244);
  doc.rect(20, yPos, 170, 45, 'F');
  doc.setFontSize(28);
  doc.setTextColor(22, 163, 74);
  doc.text(`$${result.totalMonthlySavings}/month`, 105, yPos + 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text('Potential Monthly Savings', 105, yPos + 32, { align: 'center' });
  doc.setFontSize(16);
  doc.text(`$${result.totalAnnualSavings}/year`, 105, yPos + 42, { align: 'center' });
  yPos += 55;

  // Optimization Score
  const totalCurrentSpend = result.recommendations.reduce((sum, r) => sum + r.currentSpend, 0) || 1;
  const optimizationScore = Math.round(
    Math.max(0, Math.min(100, 100 - (result.totalMonthlySavings / (totalCurrentSpend + result.totalMonthlySavings)) * 100))
  );
  
  doc.setFillColor(243, 244, 246);
  doc.rect(20, yPos, 170, 25, 'F');
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text('Optimization Score', 105, yPos + 10, { align: 'center' });
  doc.setFontSize(20);
  
  let scoreColor;
  if (optimizationScore >= 85) {
    scoreColor = [34, 197, 94];
  } else if (optimizationScore >= 70) {
    scoreColor = [16, 185, 38];
  } else if (optimizationScore >= 50) {
    scoreColor = [234, 179, 8];
  } else {
    scoreColor = [220, 38, 38];
  }
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${optimizationScore}%`, 105, yPos + 22, { align: 'center' });
  yPos += 35;

  // Quick Stats
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Quick Stats', 20, yPos);
  yPos += 10;

  const stats = [
    { label: 'Team Size', value: `${userInput.teamSize} people` },
    { label: 'Primary Use Case', value: userInput.primaryUseCase },
    { label: 'Optimizations Found', value: `${result.recommendations.length}` },
  ];

  stats.forEach((stat, i) => {
    const xPos = 20 + (i % 2) * 95;
    const rowY = yPos + Math.floor(i / 2) * 15;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(stat.label, xPos, rowY);
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text(stat.value, xPos, rowY + 7);
  });
  yPos += 30;

  // Recommendations Table - Using autoTable correctly
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Recommendations', 20, yPos);
  yPos += 10;

  const tableData = result.recommendations.map(rec => [
    rec.tool.replace('-', ' '),
    `${rec.currentPlan}`,
    `$${rec.currentSpend}/month`,
    rec.recommendedAction.substring(0, 40),
    `$${rec.monthlySavings}/month`,
  ]);

  // Use autoTable function correctly
  autoTable(doc, {
    startY: yPos,
    head: [['Tool', 'Plan', 'Current', 'Recommendation', 'Savings']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 60 },
      4: { cellWidth: 25 },
    },
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      'Powered by Credex — Get discounted AI credits from companies that overforecast',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'Savings estimates based on current pricing. Actual savings may vary.',
      105,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`ai-spend-audit-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function PDFDownloadButton({ result, userInput }: PDFReportProps) {
  return (
    <Button
      onClick={() => generatePDF({ result, userInput })}
      className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
    >
      <FileText className="h-4 w-4" />
      Download PDF Report
    </Button>
  );
}