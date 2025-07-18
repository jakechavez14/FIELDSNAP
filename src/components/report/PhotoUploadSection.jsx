import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Camera, X, Image, StickyNote } from "lucide-react";

export default function PhotoUploadSection({ photos, onPhotoUpload, onPhotoNoteChange, onPhotoRemove, isLoading }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onPhotoUpload(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onPhotoUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className="border-2 border-dashed border-slate-300 hover:border-orange-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-600">Add Photos</p>
              <p className="text-sm text-slate-500">Drag & drop or click to select photos from your device</p>
            </div>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                disabled={isLoading}
                className="hover:bg-orange-50 hover:border-orange-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? 'Uploading...' : 'Choose Photos'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photos with Notes */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Image className="w-5 h-5 text-orange-600" />
            Photos & Notes ({photos.length})
          </h3>
          
          <div className="space-y-4">
            {photos.map((photo, index) => (
              <Card key={index} className="glass-effect">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full md:w-32 h-32 object-cover rounded-lg shadow-sm"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg"
                        onClick={() => onPhotoRemove(index)}
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`note-${index}`} className="flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-blue-600" />
                        Photo Note (Optional)
                      </Label>
                      <Textarea
                        id={`note-${index}`}
                        value={photo.note}
                        onChange={(e) => onPhotoNoteChange(index, e.target.value)}
                        placeholder="Add a note about this photo..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}