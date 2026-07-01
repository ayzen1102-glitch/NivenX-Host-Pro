import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Users, Shield, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    api.get<UserRow[]>("/admin/users").then(u => { setUsers(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleRole = async (user: UserRow) => {
    setSaving(user.id);
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      const updated = await api.patch<UserRow>(`/admin/users/${user.id}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Users</h1>
            <p className="text-gray-500 text-sm">{users.length} registered users</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Joined</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-6 bg-white/5 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 w-fit ${
                      user.role === "admin" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" : "text-gray-400 bg-gray-400/10 border-gray-400/20"
                    }`}>
                      {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={saving === user.id}
                      onClick={() => toggleRole(user)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      {saving === user.id ? "Saving..." : user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No users found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
