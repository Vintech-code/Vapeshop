import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSettings, FiUser, FiBox, FiDollarSign, FiShield, FiCreditCard,
    FiBarChart2, FiEdit, FiBell, FiDatabase, FiHome, FiChevronDown, FiChevronUp, FiCheckCircle, FiUsers, FiKey, FiClock, FiMonitor
} from 'react-icons/fi';
import SideMenu from './SideMenu';

const featureSettings = [
    { key: 'profile', label: 'User Profile Setup', icon: <FiUser /> },
    { key: 'shift', label: 'Shift Management', icon: <FiClock /> },
    { key: 'sales', label: 'Sales Functions', icon: <FiDollarSign /> },
    { key: 'pos', label: 'POS Interface Customization', icon: <FiMonitor /> },
    { key: 'payment', label: 'Payment Configurations', icon: <FiCreditCard /> },
    { key: 'security', label: 'Security Settings', icon: <FiShield /> },
    { key: 'transactions', label: 'Transaction Tracking', icon: <FiBarChart2 /> },
    { key: 'notif', label: 'Notifications', icon: <FiBell /> }
];

const defaultFields = {
    profile: 'Update your name, email, and password.',
    shift: 'Manage your work shifts and breaks.',
    sales: 'Access sales entry and refund options.',
    pos: 'Customize POS layout and quick actions.',
    payment: 'Configure accepted payment methods.',
    security: 'Change PIN, enable 2FA, and manage access.',
    transactions: 'Track and review all transactions.',
    notif: 'Set up SMS/email notifications for events.'
};

const uniqueGradients = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
    "from-orange-400 to-orange-600"
];

const Settings = () => {
    const [showAll, setShowAll] = useState(false);
    const [selected, setSelected] = useState('');
    const [fields, setFields] = useState(defaultFields);
    const [saved, setSaved] = useState('');

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
                            <FiSettings className="text-blue-500" /> Settings
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
                            {showAll ? 'Hide All Features' : 'Show All Features'}
                            {showAll ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                    {showAll && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featureSettings.map((item, idx) => (
                                <div
                                    key={item.key}
                                    className={`
                                        group relative border-2 rounded-2xl p-6 flex flex-col gap-2 cursor-pointer transition-all duration-200
                                        shadow-md hover:shadow-xl
                                        bg-gradient-to-br ${uniqueGradients[idx % uniqueGradients.length]}
                                        ${selected === item.key ? 'border-blue-700 scale-105 ring-2 ring-blue-300' : 'border-transparent'}
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
                                        ) : (
                                            <div className="text-white/90 mt-2 font-medium group-hover:underline">
                                                {fields[item.key]}
                                            </div>
                                        )}
                                    </div>
                                    {selected === item.key && (
                                        <span className="absolute top-2 right-4 text-blue-100 text-xs bg-blue-700 px-2 py-1 rounded-full shadow">
                                            Editing
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {!showAll && (
                        <div className="text-center text-blue-400 mt-16 text-lg font-semibold opacity-80 select-none">
                            Click "Show All Features" to manage settings features.
                        </div>
                    )}
                    {/* Example navigation link */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/dashboard"
                            className="inline-block text-blue-600 hover:underline font-semibold"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;