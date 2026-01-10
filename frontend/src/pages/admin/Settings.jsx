import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Shield, CreditCard, Globe, Database, Users, Save } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useTheme } from '../../app/providers/ThemeProvider'

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'integration', label: 'Integrations', icon: <Globe className="w-5 h-5" /> },
    { id: 'advanced', label: 'Advanced', icon: <Database className="w-5 h-5" /> }
  ]

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully!')
      setIsSaving(false)
    }, 1500)
  }

  return (
    <>
      <Helmet>
        <title>Settings - StaySynce Admin</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure your hotel management system
            </p>
          </div>
          <Button
            onClick={handleSave}
            loading={isSaving}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>

            {/* System Status */}
            <Card className="p-6 mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="text-sm font-medium">78% used</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="text-sm">2 hours ago</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    General Settings
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Hotel Name"
                      defaultValue="StaySynce Luxury Hotel"
                    />
                    <Input
                      label="Contact Email"
                      type="email"
                      defaultValue="info@staysynce.com"
                    />
                    <Input
                      label="Contact Phone"
                      defaultValue="+1 (555) 123-4567"
                    />
                    <Input
                      label="Hotel Address"
                      defaultValue="123 Luxury Street, Hospitality City"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Appearance</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Choose between light and dark mode
                        </p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Currency & Language</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Default Currency"
                        options={[
                          { value: 'USD', label: 'USD ($)' },
                          { value: 'EUR', label: 'EUR (€)' },
                          { value: 'GBP', label: 'GBP (£)' },
                          { value: 'JPY', label: 'JPY (¥)' }
                        ]}
                        defaultValue="USD"
                      />
                      <Select
                        label="Language"
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'es', label: 'Spanish' },
                          { value: 'fr', label: 'French' },
                          { value: 'de', label: 'German' }
                        ]}
                        defaultValue="en"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notification Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Email Notifications</h3>
                    {[
                      'New booking notifications',
                      'Booking cancellation alerts',
                      'Payment failure alerts',
                      'System maintenance alerts',
                      'Monthly reports',
                      'Marketing newsletters'
                    ].map((notification) => (
                      <label key={notification} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <span>{notification}</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Enable push notifications</span>
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      </label>
                      <Input
                        label="Notification Sound"
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="70"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Security Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Authentication</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add an extra layer of security
                          </p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      </label>
                      <label className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Automatically log out inactive users
                          </p>
                        </div>
                        <select className="rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">IP Restrictions</h3>
                    <Input
                      label="Allowed IP Addresses (comma separated)"
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Audit Log</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Enable audit logging</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Log all user actions</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Log failed login attempts</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Billing Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6 text-gray-500" />
                            <div>
                              <p className="font-medium">Stripe</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                            Active
                          </span>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6 text-gray-500" />
                            <div>
                              <p className="font-medium">PayPal</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Not connected</p>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Tax Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Tax Rate (%)"
                        type="number"
                        defaultValue="8.5"
                      />
                      <Select
                        label="Tax Calculation"
                        options={[
                          { value: 'inclusive', label: 'Inclusive' },
                          { value: 'exclusive', label: 'Exclusive' }
                        ]}
                        defaultValue="inclusive"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Invoice Settings</h3>
                    <Input
                      label="Invoice Prefix"
                      defaultValue="INV-"
                    />
                    <Input
                      label="Invoice Footer Text"
                      defaultValue="Thank you for choosing StaySynce!"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'integration' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Integration Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Third-Party Integrations</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Google Analytics', status: 'connected', desc: 'Track website analytics' },
                        { name: 'Mailchimp', status: 'connected', desc: 'Email marketing' },
                        { name: 'Slack', status: 'not_connected', desc: 'Team notifications' },
                        { name: 'Zapier', status: 'connected', desc: 'Workflow automation' }
                      ].map((integration) => (
                        <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{integration.desc}</p>
                          </div>
                          {integration.status === 'connected' ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">
                              Connected
                            </span>
                          ) : (
                            <Button size="sm">Connect</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">API Keys</h3>
                    <Input
                      label="Stripe API Key"
                      type="password"
                      defaultValue="sk_test_xxxxxxxx"
                    />
                    <Input
                      label="Google Maps API Key"
                      type="password"
                      defaultValue="AIzaSyxxxxxxxx"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Advanced Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Database</h3>
                    <div className="space-y-3">
                      <Button variant="outline">Backup Database</Button>
                      <Button variant="outline">Optimize Database</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Reset All Data
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Cache Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Enable caching</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                      </label>
                      <Input
                        label="Cache Duration (seconds)"
                        type="number"
                        defaultValue="300"
                      />
                      <Button variant="outline" size="sm">Clear Cache</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Maintenance Mode</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Enable Maintenance Mode</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Site will be temporarily unavailable
                          </p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      </label>
                      <Input
                        label="Maintenance Message"
                        placeholder="Site is under maintenance..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSettings