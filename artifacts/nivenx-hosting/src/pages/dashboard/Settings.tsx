import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Check } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg("");
    try {
      await api.patch("/auth/profile", { name });
      setProfileMsg("Profile updated successfully!");
    } catch (err: any) {
      setProfileMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setPwMsg("Password must be at least 8 characters"); return; }
    setPwSaving(true);
    setPwMsg("");
    try {
      await api.patch("/auth/password", { currentPassword: currentPw, newPassword: newPw });
      setPwMsg("Password changed successfully!");
      setCurrentPw(""); setNewPw("");
    } catch (err: any) {
      setPwMsg(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your profile and security settings</p>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            Profile Information
          </h3>
          {profileMsg && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              profileMsg.includes("success") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {profileMsg.includes("success") && <Check className="w-4 h-4" />}
              {profileMsg}
            </div>
          )}
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Full name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1.5 bg-white/5 border-white/15 text-white focus:border-purple-500"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">Email address</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="mt-1.5 bg-white/5 border-white/15 text-gray-400 cursor-not-allowed"
              />
              <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={saving} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Password */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            Change Password
          </h3>
          {pwMsg && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              pwMsg.includes("success") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {pwMsg.includes("success") && <Check className="w-4 h-4" />}
              {pwMsg}
            </div>
          )}
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm">Current password</Label>
              <Input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                className="mt-1.5 bg-white/5 border-white/15 text-white focus:border-purple-500"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm">New password</Label>
              <Input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                className="mt-1.5 bg-white/5 border-white/15 text-white focus:border-purple-500"
                required
              />
            </div>
            <Button type="submit" disabled={pwSaving} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              {pwSaving ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
