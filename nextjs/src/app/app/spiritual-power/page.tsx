'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Upload, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageProvider';
import { useGlobal } from '@/lib/context/GlobalContext';

export default function SpiritualPowerPage() {
  const { user } = useGlobal();
  const { t } = useLanguage();
  
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [powerValue, setPowerValue] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const threshold = 1000; // Example threshold for low spiritual power
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, you would upload to Supabase Storage here
      // For demo purposes, we'll simulate with a local URL
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate API call
      setTimeout(() => {
        // Mock successful upload
        const mockUrl = `/uploads/spiritual-power-${user?.id}-${Date.now()}.jpg`;
        setScreenshotUrl(mockUrl);
        setSuccess(`${t('spiritualPowerUpload')} ${t('success')}`);
        setUploading(false);
        e.target.value = '';
      }, 1500);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!powerValue.trim()) {
      setError(t('powerValuePlaceholder'));
      return;
    }

    const powerNum = parseInt(powerValue);
    if (isNaN(powerNum) || powerNum < 0) {
      setError('Please enter a valid number');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // In a real app, you would save to Supabase database here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(`${t('powerValue')} ${t('success')}`);
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error('Save error:', err);
    }
  };

  const isCompliant = powerValue ? parseInt(powerValue) <= threshold : !!screenshotUrl;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('spiritualPower')}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary-600" />
            {t('helpText')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Screenshot Upload Section */}
            <div className="space-y-4">
              <h3 className="font-medium">{t('spiritualPowerScreenshot')}</h3>
              
              {screenshotUrl ? (
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={screenshotUrl}
                      alt={t('spiritualPowerScreenshot')}
                      className="rounded-xl object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setScreenshotUrl(null)}
                      className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> {t('removeScreenshot')}
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      <Upload className="mr-2 h-4 w-4" /> {t('changeScreenshot')}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors">
                  <label htmlFor="screenshot-upload" className="flex flex-col items-center pointer-events-none space-y-3">
                    <Upload className="h-10 w-10 text-primary-500" />
                    <p>{t('uploadScreenshot')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('uploading')}... {t('formats')}
                    </p>
                  </label>
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {uploading && (
                    <div className="flex items-center justify-center mt-4">
                      <Loader2 className="animate-spin h-4 w-4 border-b-2 border-primary-600" />
                    </div>
                  )}
                  {error && (
                    <div className="mt-3 p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && !uploading && (
                    <div className="mt-3 p-3 text-sm text-green-700 bg-green-50 rounded-lg">
                      {success}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Power Value Input Section */}
            <div className="space-y-4">
              <h3 className="font-medium">{t('powerValue')}</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  min="0"
                  placeholder={t('powerValuePlaceholder')}
                  value={powerValue}
                  onChange={(e) => setPowerValue(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  {t('threshold')}: {threshold} {t('compliant')}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={uploading || !powerValue.trim()}
                    className="btn btn-primary"
                  >
                    {uploading ? t('uploading') + '...' : t('save')}
                  </button>
                  {success && !uploading && (
                    <span className="ml-3 text-xs text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> {t('success')}
                    </span>
                  )}
                  {error && (
                    <span className="ml-3 text-xs text-red-600">
                      <XCircle className="mr-1 h-3 w-3" /> {error}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="space-y-3">
              <h3 className="font-medium">{t('complianceStatus')}</h3>
              <div className="flex items-center gap-3 p-4 rounded-lg">
                {isCompliant ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">{t('compliant')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800 font-medium">{t('nonCompliant')}</span>
                  </>
                )}
                <div className="flex-1 text-right text-sm text-muted-foreground">
                  {powerValue ? `${powerValue} / ${threshold}` : t('never')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {!screenshotUrl && !powerValue && (
          <CardFooter>
            <Link href="/app" className="btn btn-outline">
              ← {t('home')}
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}