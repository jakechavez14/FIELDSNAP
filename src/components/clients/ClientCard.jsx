import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  Eye
} from "lucide-react";
import { format } from "date-fns";

export default function ClientCard({ client, onClientUpdate }) {
  return (
    <Card className="glass-effect shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              {client.company ? (
                <Building className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                {client.name}
              </CardTitle>
              {client.company && (
                <p className="text-sm text-slate-600">{client.company}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{client.address}</span>
          </div>
        )}
        
        {client.notes && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-sm text-slate-600 line-clamp-2">{client.notes}</p>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Added {format(new Date(client.created_date), "MMM d, yyyy")}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-purple-50 hover:border-purple-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}