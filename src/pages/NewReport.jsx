import React, { useState, useEffect } from "react";
import { Report, CompanySettings, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Plus, 
  X,
  Save,
  User as UserIcon,
  FileText,
  Mail
} from "lucide-react";

import PhotoUploadSection from "../components/report/PhotoUploadSection";

export default function NewReport() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    job_date: new Date().toISOString().split('T')[0],
    photos: [],
    status: "draft"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (files) => {
    setIsLoading(true);
    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const uploadResults = await Promise.all(uploadPromises);
      
      const newPhotos = uploadResults.map(result => ({
        url: result.file_url,
        note: "",
        timestamp: new Date().toISOString()
      }));
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoNoteChange = (index, note) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => 
        i === index ? { ...photo, note } : photo
      )
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const shareToken = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const reportData = {
        ...formData,
        share_token: shareToken
      };
      
      await Report.create(reportData);
      navigate(createPageUrl("Reports"));
    } catch (error) {
      console.error("Error creating report:", error);
    }
    
    setIsLoading(false);
  };

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.client_name) return;
    
    setIsLoading(true);
    try {
      const shareToken = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await Report.create({
        ...formData,
        status: "draft",
        share_token: shareToken
      });
      
      navigate(createPageUrl("Reports"));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">New Report</h1>
            <p className="text-slate-600 mt-1">Snap. Note. Send.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job/Report Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Kitchen Renovation - Phase 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_date">Job Date</Label>
                  <Input
                    id="job_date"
                    type="date"
                    value={formData.job_date}
                    onChange={(e) => handleInputChange('job_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => handleInputChange('client_name', e.target.value)}
                      placeholder="Client name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Client Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => handleInputChange('client_email', e.target.value)}
                      placeholder="client@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                Photos & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUploadSection
                photos={formData.photos}
                onPhotoUpload={handlePhotoUpload}
                onPhotoNoteChange={handlePhotoNoteChange}
                onPhotoRemove={removePhoto}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              Cancel
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading || !formData.title || !formData.client_name}
              >
                Save Draft
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || !formData.title || !formData.client_name || formData.photos.length === 0}
                className="bg-orange-500 hover:bg-orange-600 min-w-[140px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Complete Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}