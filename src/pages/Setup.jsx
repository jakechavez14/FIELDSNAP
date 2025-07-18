import React, { useState } from "react";
import { CompanySettings } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Save, 
  Upload, 
  Building,
  Camera,
  ArrowRight
} from "lucide-react";

export default function SetupPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    company_name: "",
    logo_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const result = await UploadFile({ file });
      setSettings(prev => ({
        ...prev,
        logo_url: result.file_url
      }));
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await CompanySettings.create(settings);
      navigate(createPageUrl("Dashboard"));
    } catch (error)
    {
      console.error("Error saving settings:", error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome to FieldSnap!</h1>
          <p className="text-slate-600 mt-2">Let's set up your company profile to create branded reports.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-effect shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Your Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={settings.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Your Company Name, LLC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.logo_url ? (
                    <img 
                      src={settings.logo_url} 
                      alt="Company Logo" 
                      className="w-20 h-20 object-contain border rounded-lg p-1 bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo')?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isLoading ? 'Uploading...' : (settings.logo_url ? 'Change Logo' : 'Upload Logo')}
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">Optional, but recommended for professional reports.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={isLoading || !settings.company_name}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      Save & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-3 text-center">You can add more details like phone and email later in Settings.</p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}