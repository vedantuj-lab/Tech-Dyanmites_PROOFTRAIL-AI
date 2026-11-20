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
} from 'lucide-react';
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  updateAdminUserStatus,
  createAdminAssignment,
  fetchAdminAuditLogs,
} from '../../services/api';
import { User, AuditLog, ReviewAssignment } from '../../types';

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
    return <div className="py-12 text-center text-xs text-gray-400">Loading Administrator Workspace...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Registered Users</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">{data?.metrics?.total_users || 0}</div>
        </div>
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Researchers</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{data?.metrics?.researchers || 0}</div>
        </div>
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reviewers</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{data?.metrics?.reviewers || 0}</div>
        </div>
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Investigations</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{data?.metrics?.total_investigations || 0}</div>
        </div>
      </div>

      {/* User Management & Role Assignment Card */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Users className="w-4 h-4" /> Platform User Management & RBAC Permissions
          </h3>
          <span className="text-xs text-gray-400">{users.length} Registered Accounts</span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="p-3 bg-[#090D16] border border-[#2A364F] rounded-xl flex items-center justify-between text-xs gap-4"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{u.full_name}</span>
                  <span className="text-[10px] text-gray-500">({u.email})</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  ID: <span className="font-mono text-amber-400">{u.user_id}</span> | Org: {u.organization || 'None'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Switcher */}
                <select
                  value={u.role}
                  onChange={(e) => handleChangeUserRole(u, e.target.value)}
                  className="bg-[#131B2E] border border-[#2A364F] text-amber-400 font-bold text-xs rounded-lg px-2 py-1"
                >
                  <option value="RESEARCHER">RESEARCHER</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleUserStatus(u)}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                    u.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {u.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Assignment Workload Controls */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Assign Reviewer Workload
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            placeholder="Enter Session ID (e.g. SES_77d0e484)..."
            className="flex-1 bg-[#090D16] border border-[#2A364F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          />

          <select
            value={selectedReviewerId}
            onChange={(e) => setSelectedReviewerId(e.target.value)}
            className="bg-[#090D16] border border-[#2A364F] text-xs text-white rounded-xl px-4 py-2.5"
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
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-6 py-2.5 rounded-xl disabled:opacity-50"
          >
            Assign Reviewer
          </button>
        </div>
      </div>

      {/* Security Audit Trail Log */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Platform Security Audit Log
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.log_id} className="p-3 bg-[#090D16] border border-[#2A364F] rounded-xl text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-gray-200">
                <span>[{log.action}] {log.target_resource}</span>
                <span className="text-gray-500 text-[10px]">{log.timestamp.slice(0, 19)}</span>
              </div>
              <div className="text-[10px] text-gray-400">Actor User: {log.actor_user_id || 'Anonymous'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
