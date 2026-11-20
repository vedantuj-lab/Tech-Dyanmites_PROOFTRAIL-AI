import React, { useState } from 'react';
import { FileText, Upload, ShieldCheck, AlertTriangle, Loader2, File, CheckCircle2 } from 'lucide-react';
import { uploadDocumentApi } from '../services/api';
import { Source } from '../types';

interface DocumentLibraryProps {
  sessionId?: string | null;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ sessionId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedSources, setUploadedSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const targetSessionId = sessionId || `SES_DOC_${Date.now()}`;

    setLoading(true);
    setError(null);
    try {
      const res = await uploadDocumentApi(targetSessionId, file);
      setUploadedSources((prev) => [res.source, ...prev]);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Document upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" /> Document Intelligence & Upload Library
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Upload PDF, DOCX, TXT, or CSV documents to include private research materials in claim verification.
        </p>
      </div>

      {/* Upload Dropzone Card */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4 shadow-xl">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-[#2A364F] hover:border-amber-500/50 rounded-xl p-8 text-center bg-[#090D16] transition-all">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-sm font-bold text-white">
                {file ? file.name : 'Click or Drag & Drop File to Upload'}
              </div>
              <div className="text-xs text-gray-400">Supported formats: PDF, DOCX, TXT, CSV (Max 25MB)</div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-gray-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Private upload — Restricted to your session authorization</span>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
              <span>{loading ? 'Parsing...' : 'Upload Document'}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Uploaded Document Sources ({uploadedSources.length})
        </h2>

        {uploadedSources.length === 0 ? (
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center text-xs text-gray-500">
            No uploaded documents yet. Select a file above to parse.
          </div>
        ) : (
          <div className="space-y-3">
            {uploadedSources.map((s) => (
              <div key={s.source_id} className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">[{s.source_id}]</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                    USER-UPLOADED DOCUMENT
                  </span>
                </div>
                <div className="font-bold text-white text-sm">{s.title}</div>
                <div className="text-xs text-gray-300 bg-[#090D16] p-3 rounded-lg border border-[#2A364F]">
                  {s.snippet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
