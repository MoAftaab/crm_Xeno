'use client';

import { useState } from 'react';
import { Settings, Save, User, Bell, Lock, Globe, Shield, CreditCard } from 'lucide-react';

// Toggle switch component
interface ToggleSwitchProps {
  id: string;
  defaultChecked?: boolean;
}

const ToggleSwitch = ({ id, defaultChecked = false }: ToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  return (
    <div className="relative inline-block">
      <input 
        type="checkbox" 
        className="sr-only" 
        id={id} 
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div 
        className="block bg-gray-200 w-14 h-8 rounded-full cursor-pointer"
        onClick={() => setIsChecked(!isChecked)}
      ></div>
      <div 
        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition transform ${
          isChecked ? 'bg-black translate-x-6' : 'bg-white border border-gray-300'
        }`}
        onClick={() => setIsChecked(!isChecked)}
      ></div>
    </div>
  );
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#141414]">Settings</h1>
        <p className="text-[#737373] text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Settings Navigation and Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <button
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTab === 'profile' 
                ? 'bg-gray-100 text-[#141414] font-medium' 
                : 'text-[#737373] hover:text-[#141414] hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <div className={`
              p-2 rounded-lg 
              ${activeTab === 'profile' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#dbdbdb] text-[#737373]'} 
            `}>
              <User size={18} />
            </div>
            <span>Profile</span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTab === 'notifications' 
                ? 'bg-gray-100 text-[#141414] font-medium' 
                : 'text-[#737373] hover:text-[#141414] hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className={`
              p-2 rounded-lg 
              ${activeTab === 'notifications' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#dbdbdb] text-[#737373]'} 
            `}>
              <Bell size={18} />
            </div>
            <span>Notifications</span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTab === 'security' 
                ? 'bg-gray-100 text-[#141414] font-medium' 
                : 'text-[#737373] hover:text-[#141414] hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <div className={`
              p-2 rounded-lg 
              ${activeTab === 'security' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#dbdbdb] text-[#737373]'} 
            `}>
              <Lock size={18} />
            </div>
            <span>Security</span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTab === 'billing' 
                ? 'bg-gray-100 text-[#141414] font-medium' 
                : 'text-[#737373] hover:text-[#141414] hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('billing')}
          >
            <div className={`
              p-2 rounded-lg 
              ${activeTab === 'billing' 
                ? 'bg-black text-white' 
                : 'bg-white border border-[#dbdbdb] text-[#737373]'} 
            `}>
              <CreditCard size={18} />
            </div>
            <span>Billing</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white border border-[#dbdbdb] rounded-xl p-6 shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#141414]">Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#141414] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    placeholder="Your full name"
                    defaultValue="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#141414] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    placeholder="your.email@example.com"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#141414] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    placeholder="Company name"
                    defaultValue="Acme Inc."
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-[#141414] mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="w-full px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    placeholder="Tell us about yourself"
                    rows={4}
                    defaultValue="Marketing Director with 10+ years of experience in digital marketing and CRM strategies."
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="button"
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#141414]">Notification Preferences</h2>
              <p className="text-[#737373]">Configure how you receive notifications from the system.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#dbdbdb]">
                  <div>
                    <h3 className="font-medium text-[#141414]">Campaign Status Updates</h3>
                    <p className="text-sm text-[#737373]">Get notified when a campaign status changes</p>
                  </div>
                  <ToggleSwitch id="campaign-updates" defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#dbdbdb]">
                  <div>
                    <h3 className="font-medium text-[#141414]">Push Notifications</h3>
                    <p className="text-sm text-[#737373]">Receive alerts even when you're not active</p>
                  </div>
                  <ToggleSwitch id="push-toggle" />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#dbdbdb]">
                  <div>
                    <h3 className="font-medium text-[#141414]">Marketing Communications</h3>
                    <p className="text-sm text-[#737373]">Receive tips and product updates</p>
                  </div>
                  <ToggleSwitch id="marketing-toggle" defaultChecked={true} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#141414]">Security Settings</h2>
              <p className="text-[#737373]">Manage your account security settings and devices.</p>
              <div className="space-y-4">
                <button type="button" className="w-full px-4 py-3 text-left bg-white border border-[#dbdbdb] hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Shield className="mr-3 text-[#141414]" size={20} />
                    <div>
                      <h3 className="font-medium text-[#141414]">Change Password</h3>
                      <p className="text-sm text-[#737373]">Update your password regularly to keep your account secure</p>
                    </div>
                  </div>
                </button>
                <button type="button" className="w-full px-4 py-3 text-left bg-white border border-[#dbdbdb] hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Globe className="mr-3 text-[#141414]" size={20} />
                    <div>
                      <h3 className="font-medium text-[#141414]">Two-Factor Authentication</h3>
                      <p className="text-sm text-[#737373]">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#141414]">Billing Information</h2>
              <p className="text-[#737373]">Manage your subscription and payment methods.</p>
              
              <div className="p-4 bg-white rounded-lg border border-[#dbdbdb]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-[#141414]">Current Plan</h3>
                    <p className="text-[#737373] text-sm">Premium</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">Active</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-[#141414]">Payment Methods</h3>
                <div className="p-4 bg-white rounded-lg border border-[#dbdbdb] flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded mr-3">
                      <CreditCard size={24} className="text-[#141414]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#141414]">••••  ••••  ••••  1234</p>
                      <p className="text-sm text-[#737373]">Expires 12/25</p>
                    </div>
                  </div>
                  <button type="button" className="text-sm text-black hover:text-gray-600 transition-colors">Edit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 