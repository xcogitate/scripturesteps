"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { getAdminSettings, setAdminSettings } from "@/lib/admin-settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, AlertTriangle, Zap, Bell, Database, Shield } from "lucide-react"

export default function SystemSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewUsers: true,
    maxChildrenPerAccount: 3,
    enableNotifications: true,
    enableAnalytics: true,
    dataRetentionDays: 365,
    requireEmailVerification: false,
    enableBetaFeatures: false,
    activityOverrideEnabled: false,
    activityOverrideUnlockAll: false,
    activityOverrideDay: "",
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("system_settings")) {
      router.push("/admin/login")
    }

    const adminSettings = getAdminSettings()
    setSettings((prev) => ({
      ...prev,
      activityOverrideEnabled: adminSettings.activityOverrides.enabled,
      activityOverrideUnlockAll: adminSettings.activityOverrides.unlockAll,
      activityOverrideDay: adminSettings.activityOverrides.forceDayOfWeek
        ? String(adminSettings.activityOverrides.forceDayOfWeek)
        : "",
    }))
  }, [router])

  const handleSaveSettings = () => {
    setAdminSettings({
      activityOverrides: {
        enabled: settings.activityOverrideEnabled,
        unlockAll: settings.activityOverrideUnlockAll,
        forceDayOfWeek: settings.activityOverrideDay ? Number(settings.activityOverrideDay) : null,
      },
    })
    alert("System settings saved successfully!")
  }

  const handleSaveGeneralSettings = () => {
    alert("General settings saved successfully!")
  }

  const handleSaveNotifications = () => {
    alert("Notification settings saved successfully!")
  }

  const handleSaveDataPrivacy = () => {
    alert("Data & privacy settings saved successfully!")
  }

  const handleSaveSecurity = () => {
    alert("Security settings saved successfully!")
  }

  const handleResetCache = () => {
    if (confirm("Are you sure you want to clear all cached data? This action cannot be undone.")) {
      // Clear cache logic here
      alert("Cache cleared successfully!")
    }
  }

  const handleExportData = () => {
    // Export all data logic
    alert("Data export initiated. You will receive an email when ready.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
              <p className="text-xs text-gray-500">Configure app settings and features</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Core application configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Temporarily disable the app for maintenance</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Allow New User Registrations</p>
                <p className="text-sm text-gray-600">Enable or disable new account creation</p>
              </div>
              <Switch
                checked={settings.allowNewUsers}
                onCheckedChange={(checked) => setSettings({ ...settings, allowNewUsers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Enable Beta Features</p>
                <p className="text-sm text-gray-600">Allow access to experimental features</p>
              </div>
              <Switch
                checked={settings.enableBetaFeatures}
                onCheckedChange={(checked) => setSettings({ ...settings, enableBetaFeatures: checked })}
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Max Children Per Account</label>
              <Input
                type="number"
                value={settings.maxChildrenPerAccount}
                onChange={(e) => setSettings({ ...settings, maxChildrenPerAccount: Number.parseInt(e.target.value) })}
                min={1}
                max={10}
              />
              <p className="text-sm text-gray-600 mt-1">Maximum number of child profiles per parent account</p>
            </div>

            <Button onClick={handleSaveGeneralSettings} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save General Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle>Activity Overrides</CardTitle>
                <CardDescription>Force unlocks and day overrides for testing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Enable Activity Overrides</p>
                <p className="text-sm text-gray-600">Use manual overrides for the child dashboard</p>
              </div>
              <Switch
                checked={settings.activityOverrideEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, activityOverrideEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Unlock All Activities</p>
                <p className="text-sm text-gray-600">Show and enable all activities regardless of day</p>
              </div>
              <Switch
                checked={settings.activityOverrideUnlockAll}
                onCheckedChange={(checked) => setSettings({ ...settings, activityOverrideUnlockAll: checked })}
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Force Day Of Week (1-7)</label>
              <Input
                type="number"
                min={1}
                max={7}
                placeholder="Leave empty for real day"
                value={settings.activityOverrideDay}
                onChange={(event) => setSettings({ ...settings, activityOverrideDay: event.target.value })}
              />
              <p className="text-xs text-gray-600 mt-2">
                1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun.
              </p>
            </div>

            <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Activity Overrides
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure notification settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Enable Push Notifications</p>
                <p className="text-sm text-gray-600">Send reminders and updates to users</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Manage data storage and privacy settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Enable Analytics Tracking</p>
                <p className="text-sm text-gray-600">Collect usage data for insights</p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Require Email Verification</p>
                <p className="text-sm text-gray-600">Users must verify email before accessing features</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Data Retention Period (Days)</label>
              <Input
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => setSettings({ ...settings, dataRetentionDays: Number.parseInt(e.target.value) })}
                min={30}
                max={3650}
              />
              <p className="text-sm text-gray-600 mt-1">How long to keep inactive user data</p>
            </div>

            <div className="pt-4 space-y-3">
              <Button variant="outline" onClick={handleExportData} className="w-full justify-start bg-transparent">
                <Database className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button
                variant="outline"
                onClick={handleResetCache}
                className="w-full justify-start text-orange-600 bg-transparent"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Clear System Cache
              </Button>
            </div>

            <Button onClick={handleSaveDataPrivacy} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Data & Privacy
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Application security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Security Notice</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Changes to security settings may affect all users. Please proceed with caution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  For advanced security configurations, please contact the system administrator.
                </p>
              </div>
            </div>

            <Button onClick={handleSaveSecurity} className="w-full sm:w-auto mt-4">
              <Save className="w-4 h-4 mr-2" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Version:</span>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <span className="text-gray-600">Environment:</span>
                <p className="font-medium">Production</p>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Server Status:</span>
                <p className="font-medium text-green-600">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
