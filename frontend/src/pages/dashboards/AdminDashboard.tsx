import React, { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  Activity,
  Cpu,
  Search as SearchIcon,
  Database,
  Lock,
  Sliders,
} from 'lucide-react';
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  updateAdminUserStatus,
  createAdminAssignment,
  fetchAdminAuditLogs,
} from '../../services/api';
import { User, AuditLog, ReviewAssignment } from '../../types';
import { Settings } from '../Settings';

interface AdminDashboardProps {
  currentSubTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentSubTab }) => {
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAdminData = () => {
    setLoading(true);
    Promise.all([
      fetchAdminDashboard(),
      fetchAdminUsers(),
      fetchAdminAuditLogs(),
    ])
      .then(([dashData, userData, logsData]) => {
        setData(dashData);
        setUsers(userData);
        setAuditLogs(logsData);
        const reviewers = userData.filter((u) => u.role === 'REVIEWER');
        if (reviewers.length > 0) {
          setSelectedReviewerId(reviewers[0].user_id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await updateAdminUserStatus(user.user_id, nextStatus);
    loadAdminData();
  };

  const handleChangeUserRole = async (user: User, newRole: string) => {
    await updateAdminUserStatus(user.user_id, user.status || 'ACTIVE', newRole);
    loadAdminData();
  };

  const handleCreateAssignment = async () => {
    if (!selectedSessionId || !selectedReviewerId) return;
    await createAdminAssignment(selectedSessionId, selectedReviewerId, 7);
    setSelectedSessionId('');
    loadAdminData();
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400 font-mono">Loading Administrator Workspace...</div>;
  }

  // --- SUB-VIEW ROUTER FOR ADMIN ROLE ---
  if (currentSubTab === 'Settings') {
    return <Settings />;
  }

  if (currentSubTab === 'Audit Logs') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-rose-400" /> Platform Security Audit Trail
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Immutable log of system actions, role assignment updates, and security events.
          </p>
        </div>

        <div className="bg-[#450A0A] border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">Audit Trail Records</div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.log_id} className="p-3 bg-[#2A0505] border border-rose-900/50 rounded-xl text-xs space-y-0.5">
                <div className="flex justify-between font-bold text-gray-200">
                  <span>[{log.action}] {log.target_resource}</span>
                  <span className="text-gray-400 text-[10px]">{log.timestamp.slice(0, 19)}</span>
                </div>
                <div className="text-[10px] text-rose-300">Actor User: {log.actor_user_id || 'Anonymous'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentSubTab === 'Review Assignments') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Peer-Review Assignment Workload
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Assign completed research investigations to reviewers and track review completion statuses.
          </p>
        </div>

        <div className="bg-[#064E3B] border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Assign New Review Workload</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              placeholder="Enter Session ID (e.g. SES_EV_2027)..."
              className="flex-1 bg-[#022C22] border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
            <select
              value={selectedReviewerId}
              onChange={(e) => setSelectedReviewerId(e.target.value)}
              className="bg-[#022C22] border border-emerald-800 text-xs text-white rounded-xl px-4 py-2.5"
            >
              {users
                .filter((u) => u.role === 'REVIEWER' || u.role === 'ADMIN')
                .map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.full_name} ({u.role})
                  </option>
                ))}
            </select>
            <button
              onClick={handleCreateAssignment}
              disabled={!selectedSessionId || !selectedReviewerId}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all"
            >
              Assign Reviewer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentSubTab === 'User Management') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" /> User Directory &amp; RBAC Access Control
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage registered accounts, toggle active/suspended statuses, and assign platform roles.
          </p>
        </div>

        <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Registered Platform Users</span>
            <span className="text-xs text-sky-200">{users.length} Total Users</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u.user_id}
                className="p-3 bg-[#032B45] border border-sky-800/60 rounded-xl flex items-center justify-between text-xs gap-4"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{u.full_name}</span>
                    <span className="text-[10px] text-sky-300">({u.email})</span>
                  </div>
                  <div className="text-[10px] text-gray-300 mt-0.5">
                    ID: <span className="font-mono text-sky-300">{u.user_id}</span> | Org: {u.organization || 'None'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeUserRole(u, e.target.value)}
                    className="bg-[#0C4A6E] border border-sky-600 text-sky-300 font-bold text-xs rounded-lg px-2 py-1"
                  >
                    <option value="RESEARCHER">RESEARCHER</option>
                    <option value="REVIEWER">REVIEWER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  <button
                    onClick={() => handleToggleUserStatus(u)}
                    className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {u.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default Admin View: 'Platform Overview'
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Total Registered Users</div>
          <div className="text-2xl font-extrabold text-sky-400 mt-1">{data?.metrics?.total_users || 0}</div>
        </div>
        <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Researchers</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{data?.metrics?.researchers || 0}</div>
        </div>
        <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Reviewers</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{data?.metrics?.reviewers || 0}</div>
        </div>
        <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Total Investigations</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{data?.metrics?.total_investigations || 0}</div>
        </div>
      </div>

      {/* User Management Overview Preview */}
      <div className="bg-[#0C4A6E] border border-sky-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-2">
            <Users className="w-4 h-4" /> Platform User Directory Overview
          </h3>
          <span className="text-xs text-sky-200">{users.length} Active Accounts</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.slice(0, 5).map((u) => (
            <div
              key={u.user_id}
              className="p-3 bg-[#032B45] border border-sky-800/60 rounded-xl flex items-center justify-between text-xs gap-4"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{u.full_name}</span>
                  <span className="text-[10px] text-sky-300">({u.email})</span>
                </div>
                <div className="text-[10px] text-gray-300 mt-0.5">
                  ID: <span className="font-mono text-sky-300">{u.user_id}</span> | Org: {u.organization || 'None'}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
