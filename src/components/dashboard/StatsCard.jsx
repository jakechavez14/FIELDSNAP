import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  textColor, 
  bgLight, 
  trend 
}) {
  return (
    <Card className="glass-effect shadow-lg hover:shadow-xl transition-all duration-300 border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgLight}`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-sm text-slate-600">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}