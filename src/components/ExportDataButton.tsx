import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileJson, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface ExportDataButtonProps {
  activities: any[];
  behaviors: any[];
  children: any[];
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({
  activities,
  behaviors,
  children
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const exportToCSV = () => {
    setIsExporting(true);
    
    // Create CSV headers
    const headers = ['Date', 'Child', 'Type', 'Category', 'Description', 'Duration (min)', 'Completed'];
    
    // Create CSV rows
    const rows = activities.map(activity => {
      const child = children.find(c => c.id === activity.child_id);
      return [
        format(new Date(activity.date), 'yyyy-MM-dd'),
        child?.name || 'Unknown',
        activity.type,
        activity.category,
        activity.description,
        activity.duration || '',
        activity.completed ? 'Yes' : 'No'
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `summer-success-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('CSV');
  };

  const exportToJSON = () => {
    setIsExporting(true);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      children,
      activities,
      behaviors,
      summary: {
        totalActivities: activities.length,
        totalBehaviors: behaviors.length,
        dateRange: {
          start: activities.length > 0 ? activities[0].date : null,
          end: activities.length > 0 ? activities[activities.length - 1].date : null
        }
      }
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `summer-success-${format(new Date(), 'yyyy-MM-dd')}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('JSON');
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(147, 51, 234); // Purple color
    doc.text('Summer Success Report', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 14, 32);
    
    // Add summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Summary', 14, 45);
    
    doc.setFontSize(10);
    doc.text(`Total Activities: ${activities.length}`, 14, 52);
    doc.text(`Total Behaviors Logged: ${behaviors.length}`, 14, 58);
    
    // Add children summary
    let yPos = 70;
    children.forEach(child => {
      const childActivities = activities.filter(a => a.child_id === child.id);
      const childBehaviors = behaviors.filter(b => b.child_id === child.id);
      
      doc.setFontSize(12);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text(child.name, 14, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Activities: ${childActivities.length}`, 24, yPos + 6);
      doc.text(`Behaviors: ${childBehaviors.length}`, 24, yPos + 12);
      
      yPos += 20;
    });
    
    // Add activities table
    if (activities.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(147, 51, 234);
      doc.text('Activities Log', 14, 22);
      
      const tableData = activities.map(activity => {
        const child = children.find(c => c.id === activity.child_id);
        return [
          format(new Date(activity.date), 'MMM d'),
          child?.name || 'Unknown',
          activity.type,
          activity.category,
          activity.duration ? `${activity.duration}m` : '-'
        ];
      });
      
      autoTable(doc, {
        head: [['Date', 'Child', 'Type', 'Category', 'Duration']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    }
    
    // Save the PDF
    doc.save(`summer-success-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    showSuccessToast('PDF');
  };

  const showSuccessToast = (format: string) => {
    setLastExport(format);
    toast.success(
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span>{format} exported successfully!</span>
      </motion.div>
    );
    
    setTimeout(() => {
      setIsExporting(false);
      setLastExport(null);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isExporting}
          >
            {isExporting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export Data
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          <span>Export as CSV</span>
          {lastExport === 'CSV' && (
            <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileJson className="w-4 h-4 mr-2" />
          <span>Export as JSON</span>
          {lastExport === 'JSON' && (
            <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          <span>Export as PDF</span>
          {lastExport === 'PDF' && (
            <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDataButton;