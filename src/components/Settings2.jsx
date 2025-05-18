import { useState } from 'react';
import {
    FiSettings, FiUser, FiBox, FiDollarSign, FiShield, FiCreditCard,
    FiBarChart2, FiEdit, FiBell, FiDatabase, FiHome, FiChevronDown, FiChevronUp, FiCheckCircle, FiUsers, FiKey
} from 'react-icons/fi';
import SideMenu from './SideMenu';

const adminSettings = [
    { key: 'userRole', label: 'User & Role Management', icon: <FiUser /> },
    { key: 'inventory', label: 'Inventory Control', icon: <FiBox /> },
    { key: 'sales', label: 'Sales & Transaction Settings', icon: <FiDollarSign /> },
    { key: 'security', label: 'Security & Access Control', icon: <FiShield /> },
    { key: 'payment', label: 'Payment & Billing', icon: <FiCreditCard /> },
    { key: 'reports', label: 'Reports & Analytics', icon: <FiBarChart2 /> },
    { key: 'custom', label: 'Store Customization', icon: <FiHome /> },
    { key: 'backup', label: 'Backup & Recovery', icon: <FiDatabase /> },
    { key: 'notif', label: 'Notification & Alerts', icon: <FiBell /> }
];

const defaultFields = {
    userRole: 'Manage users, assign roles, set permissions.',
    inventory: 'Track stock, set reorder levels, manage suppliers.',
    sales: 'Configure discounts, taxes, and transaction rules.',
    security: 'Set password policies, 2FA, and access logs.',
    payment: 'Manage payment methods, billing cycles, and invoices.',
    reports: 'View sales, inventory, and user activity reports.',
    custom: 'Change store theme, logo, and display settings.',
    backup: 'Schedule backups, restore data, and export settings.',
    notif: 'Set up email/SMS alerts for important events.'
};

const uniqueGradients = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
    "from-orange-400 to-orange-600",
    "from-gray-400 to-gray-600"
];

const userRoleSubSettings = [
    { key: 'users', label: 'Users', icon: <FiUsers />, desc: 'View and manage all users.' },
    { key: 'roles', label: 'Roles', icon: <FiKey />, desc: 'Define roles and permissions.' }
];

const Settings2 = () => {
    const [showAll, setShowAll] = useState(false);
    const [selected, setSelected] = useState('');
    const [fields, setFields] = useState(defaultFields);
    const [saved, setSaved] = useState('');
    const [userRoleTab, setUserRoleTab] = useState('users');

    const handleFieldChange = (key, value) => {
        setFields({ ...fields, [key]: value });
    };

    const handleSave = (key) => {
        setSaved(key);
        setTimeout(() => setSaved(''), 1200);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            {/* Fixed SideMenu */}
            <aside className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 z-30 overflow-y-auto">
                <SideMenu />
            </aside>
            {/* Main Content with left margin */}
            <div className="flex-1 ml-60 flex flex-col items-center py-10">
                <div className="bg-white/90 rounded-3xl shadow-2xl p-10 w-full max-w-3xl border border-blue-100">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-extrabold flex items-center gap-3 text-blue-700 drop-shadow">
                            <FiSettings className="text-blue-500" /> Admin Settings
                        </h1>
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className={`transition flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow
                                ${showAll
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-blue-700 hover:from-blue-100 hover:to-indigo-100'}
                            `}
                        >
                            <FiEdit />
                            {showAll ? 'Hide All Settings' : 'Show All Settings'}
                            {showAll ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                    {showAll && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {adminSettings.map((item, idx) => (
                                <div
                                    key={item.key}
                                    className={`
                                        group relative border-2 rounded-2xl p-6 flex flex-col gap-2 cursor-pointer transition-all duration-200
                                        shadow-md hover:shadow-xl
                                        bg-gradient-to-br ${uniqueGradients[idx % uniqueGradients.length]}
                                        ${selected === item.key ? 'border-blue-700 scale-105 ring-2 ring-blue-300' : 'border-transparent'}
                                        ${item.key === 'userRole' ? 'opacity-90' : ''}
                                    `}
                                    onClick={() => setSelected(item.key)}
                                    tabIndex={0}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelected(item.key)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl drop-shadow text-white">{item.icon}</span>
                                        <span className="font-bold text-lg text-white drop-shadow">{item.label}</span>
                                    </div>
                                    <div className="flex-1 mt-2">
                                        {selected === item.key ? (
                                            item.key === 'userRole' ? (
                                                <div className="bg-white/80 rounded-xl p-4 shadow-inner">
                                                    <div className="flex gap-2 mb-4">
                                                        {userRoleSubSettings.map(tab => (
                                                            <button
                                                                key={tab.key}
                                                                onClick={e => { e.stopPropagation(); setUserRoleTab(tab.key); }}
                                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition
                                                                    ${userRoleTab === tab.key
                                                                        ? 'bg-blue-600 text-white shadow'
                                                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                                                                `}
                                                            >
                                                                {tab.icon} {tab.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="font-bold text-blue-700 mb-1">{userRoleSubSettings.find(t => t.key === userRoleTab)?.label}</div>
                                                        <div className="text-blue-900 mb-3">{userRoleSubSettings.find(t => t.key === userRoleTab)?.desc}</div>
                                                        <input
                                                            type="text"
                                                            value={fields.userRole}
                                                            disabled
                                                            className="w-full p-2 border-2 border-blue-200 rounded-lg bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                                                        />
                                                        <div className="mt-2 text-xs text-blue-500 italic">This section is managed by the system administrator.</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={fields[item.key]}
                                                        onChange={e => handleFieldChange(item.key, e.target.value)}
                                                        className="mt-2 w-full p-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-blue-900 font-semibold"
                                                        autoFocus
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleSave(item.key); }}
                                                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg font-semibold shadow flex items-center gap-2"
                                                    >
                                                        <FiCheckCircle /> Save
                                                    </button>
                                                    {saved === item.key && (
                                                        <span className="ml-3 text-green-700 font-semibold animate-pulse">Saved!</span>
                                                    )}
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-white/90 mt-2 font-medium group-hover:underline">
                                                {fields[item.key]}
                                            </div>
                                        )}
                                    </div>
                                    {selected === item.key && (
                                        <span className="absolute top-2 right-4 text-blue-100 text-xs bg-blue-700 px-2 py-1 rounded-full shadow">
                                            {item.key === 'userRole' ? 'View Only' : 'Editing'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {!showAll && (
                        <div className="text-center text-blue-400 mt-16 text-lg font-semibold opacity-80 select-none">
                            Click "Show All Settings" to manage admin settings.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings2;