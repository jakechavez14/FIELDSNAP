import React, { useState } from 'react';
import { Report } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Camera,
  Eye,
  Share2,
  Copy,
  Check,
  FileText,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

const statusConfig = {
  'draft': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: FileText
  },
  'completed': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Check
  },
  'sent': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Share2
  }
};

export default function ReportCard({ report, onReportUpdate }) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const StatusIcon = statusConfig[report.status]?.icon || FileText;
  const photoCount = report.photos?.length || 0;

  const generateShareLink = async () => {
    setIsSharing(true);
    try {
      let shareToken = report.share_token;
      
      if (!shareToken) {
        shareToken = `report_${report.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await Report.update(report.id, { 
          share_token: shareToken,
          status: 'sent'
        });
        onReportUpdate();
      }
      
      const shareUrl = `${window.location.origin}${createPageUrl('ReportView')}?token=${shareToken}`;
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error generating share link:", error);
    }
    setIsSharing(false);
  };

  return (
    <Card className="glass-effect shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {report.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`${statusConfig[report.status]?.color} border flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {report.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Camera className="w-4 h-4" />
            {photoCount}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{report.client_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(report.job_date || report.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-2">
          <Button 
            variant="outline" 
            className="w-full hover:bg-blue-50 hover:border-blue-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Report
          </Button>
          
          <Button 
            variant={report.status === 'sent' ? "secondary" : "default"}
            className="w-full"
            onClick={generateShareLink}
            disabled={isSharing}
          >
            {isSharing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                {report.status === 'sent' ? 'Copy Share Link' : 'Share with Client'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}