import React, { useState } from 'react';
import { Globe, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { importWebsiteApi } from '../services/api';
import { Source } from '../types';

interface WebsiteImporterProps {
  sessionId?: string | null;
}

export const WebsiteImporter: React.FC<WebsiteImporterProps> = ({ sessionId }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedSources, setImportedSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const targetSessionId = sessionId || `SES_IMP_${Date.now()}`;

    setLoading(true);
    setError(null);
    try {
      const res = await importWebsiteApi(targetSessionId, url);
      setImportedSources((prev) => [res.source, ...prev]);
      setUrl('');
    } catch (err: any) {
      setError(err.message || 'Website import failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-amber-400" /> Dedicated Website Importer
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Import permitted web URLs directly into the Evidence Intelligence Engine with SSRF safeguards.
        </p>
      </div>

      {/* Import Form Card */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4 shadow-xl">
        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Website URL to Import
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://niti.gov.in/reports/ev-charging-guidelines"
                className="flex-1 bg-[#090D16] border border-[#2A364F] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs px-6 py-3 rounded-xl disabled:opacity-50 transition-all shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{loading ? 'Importing...' : 'Import Website'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> SSRF Defense Active
            </span>
            <span>● Sanitizes untrusted instructions</span>
            <span>● Strips parameter tracking</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Imported Web Sources List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          User-Imported Web Sources ({importedSources.length})
        </h2>

        {importedSources.length === 0 ? (
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center text-xs text-gray-500">
            No user-imported websites yet. Enter a URL above to import.
          </div>
        ) : (
          <div className="space-y-3">
            {importedSources.map((s) => (
              <div key={s.source_id} className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">[{s.source_id}]</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    USER-IMPORTED WEBSITE
                  </span>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-1 text-sm"
                >
                  <span>{s.title}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
