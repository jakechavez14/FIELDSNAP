
import React, { useState, useEffect } from "react";
import { Report, CompanySettings, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Camera, 
  FileText, 
  Users, 
  TrendingUp,
  ArrowRight,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import RecentReports from "../components/dashboard/RecentReports";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const settingsData = await CompanySettings.list();
      if (settingsData.length === 0) {
        // This is a new user, redirect to setup
        navigate(createPageUrl('Setup'));
        return; // Stop further execution
      }
      setCompanySettings(settingsData[0]);

      const reportsData = await Report.list("-created_date", 10);
      setReports(reportsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportStats = () => {
    const total = reports.length;
    const completed = reports.filter(report => report.status === 'completed').length;
    const draft = reports.filter(report => report.status === 'draft').length;
    const sent = reports.filter(report => report.status === 'sent').length;
    
    return { total, completed, draft, sent };
  };

  const stats = getReportStats();

  // This prevents a flash of the dashboard content before redirection
  if (isLoading || !companySettings) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Welcome back{companySettings?.company_name ? `, ${companySettings.company_name}` : ''}
            </h1>
            <p className="text-slate-600 text-lg">
              Snap. Note. Send. - Professional reports in minutes
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("NewReport")} className="flex-1 md:flex-none">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Report
              </Button>
            </Link>
            <Link to={createPageUrl("Settings")}>
              <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                <Camera className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
            bgColor="bg-blue-500"
            textColor="text-blue-600"
            bgLight="bg-blue-100"
            trend={`${stats.completed} completed`}
          />
          <StatsCard
            title="Draft Reports"
            value={stats.draft}
            icon={Camera}
            bgColor="bg-yellow-500"
            textColor="text-yellow-600"
            bgLight="bg-yellow-100"
            trend="In progress"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={TrendingUp}
            bgColor="bg-green-500"
            textColor="text-green-600"
            bgLight="bg-green-100"
            trend="This month"
          />
          <StatsCard
            title="Sent Reports"
            value={stats.sent}
            icon={Users}
            bgColor="bg-purple-500"
            textColor="text-purple-600"
            bgLight="bg-purple-100"
            trend="To clients"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <RecentReports 
              reports={reports} 
              isLoading={isLoading}
              onReportUpdate={loadData}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <QuickActions companySettings={companySettings} />
            
            {/* Setup Reminder */}
            {!companySettings && (
              <Card className="glass-effect shadow-lg border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-700">
                    <Camera className="w-5 h-5" />
                    Complete Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 mb-4">
                    Add your company logo and contact info to create professional branded reports.
                  </p>
                  <Link to={createPageUrl("Settings")}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Setup Company Info
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
