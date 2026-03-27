"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const ADMIN_EMAILS = ["easyclaw8@gmail.com"];

interface UserSettings {
  id: string;
  clerk_user_id: string;
  email: string | null;
  credits: number;
  plan: string;
  referral_code: string | null;
  referred_by: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<UserSettings[]>([]);
  const [jobCounts, setJobCounts] = useState<Record<string, { total: number; completed: number }>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [creditInput, setCreditInput] = useState<Record<string, string>>({});

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setJobCounts(data.jobCounts || {});
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setLoading(false);
  }, [isAdmin, fetchUsers]);

  const handleAddCredits = async (clerkUserId: string, amount: number) => {
    setActionLoading(clerkUserId);
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId, addCredits: amount }),
      });
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetPlan = async (clerkUserId: string, plan: string) => {
    setActionLoading(clerkUserId);
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId, plan }),
      });
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">你冇 admin 權限</p>
          <Link href="/dashboard" className="text-orange-400 hover:underline">返回 Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📺</span>
              <span className="text-lg font-bold">談笑書生</span>
            </Link>
            <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400 font-medium">
              ADMIN
            </span>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            返回 Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400 mb-8">管理用戶、Credits 同 Plans</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-2xl font-bold text-orange-400">{users.length}</div>
            <div className="text-sm text-gray-400">總用戶</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-2xl font-bold text-green-400">
              {users.reduce((sum, u) => sum + (u.credits || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">總 Credits</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-2xl font-bold text-blue-400">
              {Object.values(jobCounts).reduce((sum, j) => sum + j.total, 0)}
            </div>
            <div className="text-sm text-gray-400">總 Jobs</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-2xl font-bold text-purple-400">
              {Object.values(jobCounts).reduce((sum, j) => sum + j.completed, 0)}
            </div>
            <div className="text-sm text-gray-400">完成影片</div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">載入中...</div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-gray-400">
                  <th className="px-4 py-3">用戶</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Jobs</th>
                  <th className="px-4 py-3">Referral</th>
                  <th className="px-4 py-3">註冊日期</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const jobs = jobCounts[u.clerk_user_id] || { total: 0, completed: 0 };
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.email || u.clerk_user_id.slice(0, 12)}</div>
                        <div className="text-xs text-gray-500">{u.clerk_user_id.slice(0, 20)}...</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-orange-400">{u.credits || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.plan || "free"}
                          onChange={(e) => handleSetPlan(u.clerk_user_id, e.target.value)}
                          disabled={actionLoading === u.clerk_user_id}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                        >
                          <option value="free">Free</option>
                          <option value="starter">Starter $20</option>
                          <option value="business">Business $50</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {jobs.completed}/{jobs.total}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {u.referral_code || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("zh-HK")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="100"
                            value={creditInput[u.clerk_user_id] || ""}
                            onChange={(e) => setCreditInput({ ...creditInput, [u.clerk_user_id]: e.target.value })}
                            className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() => {
                              const amt = parseInt(creditInput[u.clerk_user_id] || "100");
                              handleAddCredits(u.clerk_user_id, amt);
                              setCreditInput({ ...creditInput, [u.clerk_user_id]: "" });
                            }}
                            disabled={actionLoading === u.clerk_user_id}
                            className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded text-xs hover:bg-green-500/30 disabled:opacity-50"
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              const amt = parseInt(creditInput[u.clerk_user_id] || "100");
                              handleAddCredits(u.clerk_user_id, -amt);
                              setCreditInput({ ...creditInput, [u.clerk_user_id]: "" });
                            }}
                            disabled={actionLoading === u.clerk_user_id}
                            className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/30 disabled:opacity-50"
                          >
                            -
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
