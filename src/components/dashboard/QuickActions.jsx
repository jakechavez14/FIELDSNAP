import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  FileText, 
  Settings, 
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions({ companySettings }) {
  const actions = [
    {
      title: "New Report",
      description: "Create professional report",
      icon: Camera,
      color: "bg-orange-500 hover:bg-orange-600",
      link: createPageUrl("NewReport")
    },
    {
      title: "View Reports",
      description: "Manage all reports",
      icon: FileText,
      color: "bg-blue-500 hover:bg-blue-600",
      link: createPageUrl("Reports")
    },
    {
      title: "Settings",
      description: companySettings ? "Update company info" : "Setup company branding",
      icon: Settings,
      color: "bg-purple-500 hover:bg-purple-600",
      link: createPageUrl("Settings")
    }
  ];

  return (
    <Card className="glass-effect shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.link} className="block">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 hover:shadow-md transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-700">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}