
import React, { useState, useEffect } from "react";
import { Job, Client, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Plus, 
  X,
  Save,
  MapPin,
  User as UserIcon, // Renamed to avoid conflict with imported User entity
  FileText
} from "lucide-react";

import PhotoUpload from "../components/job/PhotoUpload";
import ClientSelector from "../components/job/ClientSelector";

export default function NewJob() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client_id: "",
    client_name: "",
    location: "",
    description: "",
    category: "",
    priority: "medium",
    estimated_duration: "",
    materials_used: "",
    before_photos: [],
    after_photos: [],
    scheduled_date: "",
    status: "in_progress"
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // The new RLS rules handle created_by filtering automatically
      const clientsData = await Client.list();
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      client_name: client ? client.name : ""
    }));
  };

  const handlePhotoUpload = async (files, type) => {
    const uploadPromises = files.map(file => UploadFile({ file }));
    const uploadResults = await Promise.all(uploadPromises);
    const photoUrls = uploadResults.map(result => result.file_url);
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...photoUrls]
    }));
  };

  const removePhoto = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Generate a unique share token for this job
      const shareToken = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const jobData = {
        ...formData,
        share_token: shareToken
      };
      
      await Job.create(jobData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error creating job:", error);
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
            <h1 className="text-3xl font-bold text-slate-800">New Job</h1>
            <p className="text-slate-600 mt-1">Document your professional work</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Kitchen Pipe Repair"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="general_maintenance">General Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Job address or location"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the work being performed..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Selection */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-purple-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientSelector
                clients={clients}
                selectedClientId={formData.client_id}
                onClientSelect={handleClientSelect}
                onClientUpdate={loadClients}
              />
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PhotoUpload
                title="Before Photos"
                photos={formData.before_photos}
                onPhotoUpload={(files) => handlePhotoUpload(files, 'before_photos')}
                onPhotoRemove={(index) => removePhoto(index, 'before_photos')}
              />
              <PhotoUpload
                title="After Photos"
                photos={formData.after_photos}
                onPhotoUpload={(files) => handlePhotoUpload(files, 'after_photos')}
                onPhotoRemove={(index) => removePhoto(index, 'after_photos')}
              />
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_duration">Estimated Duration</Label>
                  <Input
                    id="estimated_duration"
                    value={formData.estimated_duration}
                    onChange={(e) => handleInputChange('estimated_duration', e.target.value)}
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials_used">Materials & Tools</Label>
                <Textarea
                  id="materials_used"
                  value={formData.materials_used}
                  onChange={(e) => handleInputChange('materials_used', e.target.value)}
                  placeholder="List materials and tools used..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title || !formData.client_name || !formData.location}
              className="bg-orange-500 hover:bg-orange-600 min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
