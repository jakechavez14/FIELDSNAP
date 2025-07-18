import React, { useState } from 'react';
import { Job } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Camera,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

const statusConfig = {
  'in_progress': {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock
  },
  'completed': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle
  },
  'scheduled': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Calendar
  }
};

const priorityConfig = {
  'urgent': 'bg-red-100 text-red-700 border-red-200',
  'high': 'bg-orange-100 text-orange-700 border-orange-200',
  'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'low': 'bg-green-100 text-green-700 border-green-200'
};

export default function JobCard({ job, onJobUpdate }) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const StatusIcon = statusConfig[job.status]?.icon || AlertCircle;
  const totalPhotos = (job.before_photos?.length || 0) + (job.after_photos?.length || 0);

  const generateShareLink = async () => {
    setIsSharing(true);
    try {
      let shareToken = job.share_token;
      
      if (!shareToken) {
        shareToken = `job_${job.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await Job.update(job.id, { 
          share_token: shareToken,
          client_shared: true 
        });
        onJobUpdate();
      }
      
      const shareUrl = `${window.location.origin}${createPageUrl('ClientView')}?token=${shareToken}`;
      
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
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`${statusConfig[job.status]?.color} border flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {job.status.replace('_', ' ')}
              </Badge>
              {job.priority && (
                <Badge variant="outline" className={priorityConfig[job.priority]}>
                  {job.priority}
                </Badge>
              )}
              {job.client_shared && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Share2 className="w-3 h-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Camera className="w-4 h-4" />
            {totalPhotos}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{job.client_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(job.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="pt-2 border-t border-slate-200 space-y-2">
          <Button 
            variant="outline" 
            className="w-full hover:bg-blue-50 hover:border-blue-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button 
            variant={job.client_shared ? "secondary" : "default"}
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
                {job.client_shared ? 'Copy Share Link' : 'Share with Client'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}