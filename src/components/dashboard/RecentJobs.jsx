
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  User,
  ArrowRight,
  AlertCircle,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
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

export default function RecentJobs({ jobs, isLoading, onJobUpdate }) {
  if (isLoading) {
    return (
      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-slate-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Jobs
          </CardTitle>
          <Link to={createPageUrl("Jobs")}>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => {
              const StatusIcon = statusConfig[job.status]?.icon || AlertCircle;
              return (
                <div key={job.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{job.client_name}</span>
                        <span className="text-slate-400">•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 mt-1" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusConfig[job.status]?.color} border flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {job.status.replace('_', ' ')}
                      </Badge>
                      {job.priority && (
                        <Badge variant="outline" className={priorityConfig[job.priority]}>
                          {job.priority}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      {format(new Date(job.created_date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No jobs yet</h3>
            <p className="text-slate-500 mb-4">Start documenting your work by creating your first job</p>
            <Link to={createPageUrl("NewJob")}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
