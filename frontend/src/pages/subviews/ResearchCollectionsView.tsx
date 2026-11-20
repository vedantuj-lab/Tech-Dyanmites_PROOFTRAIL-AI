import React, { useState } from 'react';
import { FolderKanban, Plus, FileText, Bookmark } from 'lucide-react';

export const ResearchCollectionsView: React.FC = () => {
  const [collections, setCollections] = useState([
    { id: 'col1', name: 'EV & Mobility Research', count: 4, desc: 'EV charging infrastructure, DISCOM power tariffs, and FAME subsidies.' },
    { id: 'col2', name: 'Climate & Trade Regulations', count: 2, desc: 'EU CBAM policy impact analysis and carbon compliance reports.' },
    { id: 'col3', name: 'SMR Nuclear Datacenter Energy', count: 3, desc: 'Small modular reactor deployment timelines and commercial viability.' },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" /> Research Collections & Folders
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Organize investigations, save research topics, and bookmark verified source materials.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl transition-all">
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div key={col.id} className="bg-[#0B1E28] border border-cyan-500/30 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <Bookmark className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                {col.count} Items
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{col.name}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{col.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
