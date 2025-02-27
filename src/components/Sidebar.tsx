import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Store, 
  CreditCard, 
  MessageSquare, 
  BarChart4, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
    { path: '/admin/requests', icon: <ClipboardList size={20} />, label: 'Request Monitoring' },
    { path: '/admin/shopkeepers', icon: <Store size={20} />, label: 'Shopkeeper Selection' },
    { path: '/admin/transactions', icon: <CreditCard size={20} />, label: 'Transactions' },
    { path: '/admin/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' },
    { path: '/admin/reports', icon: <BarChart4 size={20} />, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 inset-y-0 left-0 z-40
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-200 ease-in-out
        bg-gray-800 text-white w-64 h-screen overflow-y-auto
      `}>
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 pt-5 overflow-y-auto">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-5 py-3 ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                  end={item.path === '/admin'}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-5 border-t border-gray-700">
          <button className="flex items-center text-gray-300 hover:text-white w-full">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;