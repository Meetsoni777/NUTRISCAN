"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadScan } from "@/lib/api/scan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadScan(file);
      toast.success("Scan complete!"); router.push(`/scan-result/${result.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Scan failed");
    } finally { setIsUploading(false); }
  };

  const clearFile = () => { setFile(null); setPreview(null); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 md:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-voice text-[32px] font-medium">Scan a food label</h1>
        <p className="text-text-secondary">Upload or capture a photo of any food label to get instant analysis</p>
      </div>
      <Card className="border-border bg-surface-1">
        <CardContent className="p-8">
          {!preview ? (
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 transition-colors ${isDragging ? "border-accent-cyan bg-accent-cyan/5" : "border-border hover:border-border-strong hover:bg-surface-2"}`}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-dark text-accent-cyan">
                <Upload className="h-7 w-7" />
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">Drop your image here, or click to browse</p>
              <p className="text-xs text-text-tertiary">Supports JPG, PNG, HEIC — up to 10MB</p>
              <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={preview} alt="Label preview" className="w-full object-contain max-h-[400px]" />
                <button onClick={clearFile} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-0/80 text-foreground backdrop-blur-sm transition-colors hover:bg-surface-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={isUploading} className="flex-1 bg-accent-cyan text-background hover:bg-accent-cyan-light">
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                  {isUploading ? "Analyzing..." : "Analyze label"}
                </Button>
                <Button variant="outline" onClick={clearFile} disabled={isUploading} className="border-border text-foreground">Choose different</Button>
              </div>
            </div>
          )}
          <div className="mt-4 md:hidden">
            <Button variant="outline" className="w-full border-border text-foreground" onClick={() => { if (inputRef.current) { inputRef.current.capture = "environment"; inputRef.current.click(); } }}>
              <Camera className="mr-2 h-4 w-4" />Use camera
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
