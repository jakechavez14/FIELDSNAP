import React, { useState, useEffect } from "react";
import { Job } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  MapPin,
  User,
  Camera,
  FileText,
  Shield,
  AlertCircle,
  Phone,
  Mail
} from "lucide-react";
import { format } from "date-fns";

export default function ClientView() {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobByToken();
  }, []);

  const loadJobByToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      setError("Invalid or missing access token");
      setIsLoading(false);
      return;
    }

    try {
      const jobs = await Job.filter({ share_token: token });
      if (jobs.length === 0) {
        setError("Job not found or access expired");
      } else {
        setJob(jobs[0]);
      }
    } catch (error) {
      setError("Error loading job details");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-64 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Error</h2>
            <p className="text-slate-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    'in_progress': { color: 'bg-orange-100 text-orange-700', icon: Clock, text: 'In Progress' },
    'completed': { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Completed' },
    'scheduled': { color: 'bg-blue-100 text-blue-700', icon: Calendar, text: 'Scheduled' }
  };

  const StatusIcon = statusConfig[job.status]?.icon || Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Job Documentation</h1>
          <p className="text-slate-600">Professional work completed for you</p>
        </div>

        {/* Job Details */}
        <Card className="glass-effect shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-800">{job.title}</CardTitle>
              <Badge className={`${statusConfig[job.status]?.color} flex items-center gap-2`}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig[job.status]?.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-5 h-5" />
                <span className="font-medium">Client:</span>
                <span>{job.client_name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Location:</span>
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Date:</span>
                <span>{format(new Date(job.created_date), "MMMM d, yyyy")}</span>
              </div>
              {job.completed_date && (
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed:</span>
                  <span>{format(new Date(job.completed_date), "MMMM d, yyyy")}</span>
                </div>
              )}
            </div>
            
            {job.description && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2">Work Description</h3>
                <p className="text-slate-600">{job.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Before & After Photos */}
        {(job.before_photos?.length > 0 || job.after_photos?.length > 0) && (
          <Card className="glass-effect shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {job.before_photos?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Before Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {job.before_photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Before work ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {job.after_photos?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">After Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {job.after_photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`After work ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => window.open(photo, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Work Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {job.materials_used && (
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Materials & Tools Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{job.materials_used}</p>
              </CardContent>
            </Card>
          )}

          {job.completion_notes && (
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Completion Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{job.completion_notes}</p>
              </CardContent>
            </Card>
          )}

          {job.warranty_notes && (
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Warranty Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{job.warranty_notes}</p>
              </CardContent>
            </Card>
          )}

          {job.safety_notes && (
            <Card className="glass-effect shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{job.safety_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <Card className="glass-effect shadow-lg text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-slate-700">Documented with FieldSnap</span>
            </div>
            <p className="text-sm text-slate-500">
              Professional documentation for quality assurance and your peace of mind
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}