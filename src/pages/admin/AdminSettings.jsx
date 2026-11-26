import React, { useState } from "react"
import {
  User,
  Lock,
  Bell,
  Palette,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
]

export default function AdminSettings() {
  const { settings, updateSettings, updateProfile, resetAllData, addToast } = useAdmin()

  const [activeTab, setActiveTab] = useState("profile")

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: settings.adminProfile?.name || "Dr. Vandana Rao",
    email: settings.adminProfile?.email || "admin.vandana@civicfix.gov",
    phone: settings.adminProfile?.phone || "+91 172 274000",
    title: settings.adminProfile?.title || "Senior Municipal Administrator",
    department: settings.adminProfile?.department || "Municipal Corporation Administration",
    avatar: settings.adminProfile?.avatar || AVATAR_OPTIONS[0],
    bio: settings.adminProfile?.bio || ""
  })

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    emailCritical: settings.notifications?.emailCritical ?? true,
    smsUrgent: settings.notifications?.smsUrgent ?? true,
    dailyDigest: settings.notifications?.dailyDigest ?? true,
    soundAlerts: settings.notifications?.soundAlerts ?? false
  })

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfile(profileForm)
  }

  // Password Change Handler
  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.")
      return
    }

    setPasswordSuccess(true)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    addToast("success", "Password Updated", "Your administrative login credentials have been changed.")
  }

  // Notification Preferences Save
  const handleToggleNotif = (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    updateSettings({ notifications: updated })
  }

  const handleResetConfirm = () => {
    resetAllData()
    setResetConfirmOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif">
          System & Admin Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
          Configure administrator credentials, notification rules, UI theme, and factory demo data.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#EAE3D5] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "profile"
              ? "bg-[#59343B] text-white shadow-sm"
              : "text-[#59343B] hover:bg-[#F5ECEE]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Admin Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "security"
              ? "bg-[#59343B] text-white shadow-sm"
              : "text-[#59343B] hover:bg-[#F5ECEE]"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password & Security</span>
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "notifications"
              ? "bg-[#59343B] text-white shadow-sm"
              : "text-[#59343B] hover:bg-[#F5ECEE]"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "appearance"
              ? "bg-[#59343B] text-white shadow-sm"
              : "text-[#59343B] hover:bg-[#F5ECEE]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme & Data</span>
        </button>
      </div>

      {/* Tab 1: Profile Editing */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-5 text-xs">
          <div className="flex items-center gap-4">
            <img
              src={profileForm.avatar}
              alt="Admin"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FFD20A]"
            />
            <div>
              <h3 className="text-base font-bold text-[#281719] font-serif">
                Admin Profile Picture
              </h3>
              <p className="text-[#695154] text-[11px] mt-0.5">Choose an avatar preset</p>
              <div className="flex items-center gap-2 mt-2">
                {AVATAR_OPTIONS.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, avatar: imgUrl })}
                    className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition ${
                      profileForm.avatar === imgUrl ? "border-[#FFD20A] scale-110 shadow-md ring-2 ring-[#59343B]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE3D5]">
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Phone Hotline
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Administrative Designation
              </label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#281719] mb-1">
              Department Division
            </label>
            <input
              type="text"
              value={profileForm.department}
              onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold shadow-md shadow-[#281719]/10 transition active:scale-95"
            >
              <Save className="w-4 h-4 stroke-[2.2]" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Password & Security */}
      {activeTab === "security" && (
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#281719] font-serif">
              Change Admin Access Password
            </h3>
            <p className="text-[#695154] text-[11px] mt-0.5">
              Secure your CivicFix administrative console credentials.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-[#EBF5EE] border border-[#C3E4CD] text-[#1E5C31] flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#236336] shrink-0" />
              <span>Password updated successfully.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-[#FAECEE] border border-[#EFC3C6] text-[#8C2329] flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-[#93272C] shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#281719] mb-1">
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="show-pwd"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded text-[#59343B] focus:ring-[#59343B]"
            />
            <label htmlFor="show-pwd" className="text-[#59343B] font-medium cursor-pointer">
              Show password characters
            </label>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold shadow-md shadow-[#281719]/10 transition active:scale-95"
            >
              <Lock className="w-4 h-4 stroke-[2.2]" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#281719] font-serif">
              Dispatch Alerts & Preferences
            </h3>
            <p className="text-[#695154] text-[11px] mt-0.5">
              Control when the administrative team receives emergency alerts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] cursor-pointer hover:border-[#59343B] transition">
              <div>
                <p className="font-bold text-[#281719]">
                  Critical Incident Immediate Email Alerts
                </p>
                <p className="text-[11px] text-[#695154]">
                  Receive email alerts instantly for high-risk hazards (water pipeline burst, electrical fire).
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.emailCritical}
                onChange={() => handleToggleNotif("emailCritical")}
                className="rounded text-[#59343B] focus:ring-[#59343B] h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] cursor-pointer hover:border-[#59343B] transition">
              <div>
                <p className="font-bold text-[#281719]">
                  SMS Escalation Alerts
                </p>
                <p className="text-[11px] text-[#695154]">
                  Send SMS notification to on-duty department head if response exceeds 2 hours.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.smsUrgent}
                onChange={() => handleToggleNotif("smsUrgent")}
                className="rounded text-[#59343B] focus:ring-[#59343B] h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] cursor-pointer hover:border-[#59343B] transition">
              <div>
                <p className="font-bold text-[#281719]">
                  Daily Municipal Morning Digest
                </p>
                <p className="text-[11px] text-[#695154]">
                  Daily 8:00 AM summary of pending grievances and yesterday's resolution tally.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.dailyDigest}
                onChange={() => handleToggleNotif("dailyDigest")}
                className="rounded text-[#59343B] focus:ring-[#59343B] h-4 w-4"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Theme & Mock Data Reset */}
      {activeTab === "appearance" && (
        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#281719] font-serif">
              CivicFix Brand Theme
            </h3>
            <p className="text-[#695154] text-[11px] mt-0.5">
              The dashboard adheres strictly to the official CivicFix brand identity (Warm Cream, Civic Yellow, Deep Burgundy, and Soft Beige).
            </p>
          </div>

          {/* Palette Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-[#FFF9EA] text-center">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EA] border border-[#EAE3D5] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">Warm Cream</p>
              <p className="text-[10px] text-[#695154] font-mono">#FFF9EA</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-white text-center">
              <div className="w-8 h-8 rounded-full bg-[#FFD20A] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">Civic Yellow</p>
              <p className="text-[10px] text-[#695154] font-mono">#FFD20A</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-white text-center">
              <div className="w-8 h-8 rounded-full bg-[#59343B] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">Deep Burgundy</p>
              <p className="text-[10px] text-[#695154] font-mono">#59343B</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-white text-center">
              <div className="w-8 h-8 rounded-full bg-[#281719] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">Dark Espresso</p>
              <p className="text-[10px] text-[#695154] font-mono">#281719</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-white text-center">
              <div className="w-8 h-8 rounded-full bg-white border border-[#EAE3D5] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">White</p>
              <p className="text-[10px] text-[#695154] font-mono">#FFFFFF</p>
            </div>
            <div className="p-3 rounded-2xl border border-[#EAE3D5] bg-white text-center">
              <div className="w-8 h-8 rounded-full bg-[#EAE3D5] mx-auto mb-2" />
              <p className="font-bold text-[11px] text-[#281719]">Soft Beige</p>
              <p className="text-[10px] text-[#695154] font-mono">#EAE3D5</p>
            </div>
          </div>

          {/* Reset Mock Data Section */}
          <div className="pt-5 border-t border-[#EAE3D5]">
            <div className="p-5 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#281719] font-serif text-sm">
                  Reset Mock Database to Factory State
                </h4>
                <p className="text-[11px] text-[#695154] mt-0.5">
                  Restores default sample complaints, departments, citizens, and stats. Helpful for evaluation and demonstration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#59343B] hover:bg-[#43262C] text-white font-bold shadow-sm transition shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-[#EAE3D5] text-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4D0] text-[#7A5300] flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#281719] font-serif text-center">
              Reset Demo Database?
            </h3>
            <p className="text-[#695154] text-center mt-1 leading-relaxed">
              This will re-initialize LocalStorage with the pristine mock datasets. Any newly added complaints will be overwritten.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-[#EAE3D5] text-[#59343B] font-bold hover:bg-[#FFF9EA]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 py-2 px-3 rounded-xl bg-[#59343B] hover:bg-[#43262C] text-white font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
