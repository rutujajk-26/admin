import React, { useState, useCallback } from 'react';
import { mockUsers } from '../data/mockData';
import UserTable from '../components/UserManagement/UserTable';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Search, Download, CheckCircle, Check, X, Ban, Trash2, UserCheck } from 'lucide-react';

type UserType = 'all' | 'institutes' | 'donors' | 'shopkeepers';
type UserStatus = 'all' | 'active' | 'pending' | 'blocked';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, variant, disabled }) => {
  const baseClasses = "inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    success: "text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500",
    danger: "text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500",
    warning: "text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500",
    info: "text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } sm:px-3`}
      title={label}
    >
      <span className="sr-only">{label}</span>
      {icon}
      <span className="hidden sm:ml-2 sm:inline">{label}</span>
    </button>
  );
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<UserType>('all');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Action handlers with loading states and user updates
  const handleApproveUser = useCallback(async (userId: string) => {
    try {
      setActionInProgress(userId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user status
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, status: 'active' }
            : user
        )
      );
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleBlockUser = useCallback(async (userId: string) => {
    try {
      setActionInProgress(userId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, status: 'blocked' }
            : user
        )
      );
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleUnblockUser = useCallback(async (userId: string) => {
    try {
      setActionInProgress(userId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, status: 'active' }
            : user
        )
      );
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setActionInProgress(userId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove user from the list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);

      // Create the CSV content directly with visible separators
      let csvContent = 'Name,Email,Type,Status,Phone,Address,Last Active\n';

      // Add each user's data
      filteredUsers.forEach(user => {
        const row = [
          user.name || '',
          user.email || '',
          user.type || '',
          user.status || '',
          user.phone || '',
          user.address || '',
          user.lastActive || ''
        ].map(field => {
          // Properly escape fields that contain commas or quotes
          const stringField = String(field).replace(/"/g, '""');
          return field.includes(',') ? `"${stringField}"` : stringField;
        }).join(',');

        csvContent += row + '\n';
      });

      // Create blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      // Create and click download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toLocaleDateString().replace(/\//g, '-');
      
      link.href = url;
      link.download = `user-data-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || user.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Render action buttons for a user
  const renderActionButtons = (userId: string, status: string) => (
    <div className="flex flex-wrap gap-2 justify-end">
      {status === 'pending' && (
        <ActionButton
          onClick={() => handleApproveUser(userId)}
          icon={<Check className="h-4 w-4" />}
          label="Approve"
          variant="success"
          disabled={actionInProgress === userId}
        />
      )}
      {status === 'active' && (
        <ActionButton
          onClick={() => handleBlockUser(userId)}
          icon={<Ban className="h-4 w-4" />}
          label="Block"
          variant="warning"
          disabled={actionInProgress === userId}
        />
      )}
      {status === 'blocked' && (
        <ActionButton
          onClick={() => handleUnblockUser(userId)}
          icon={<UserCheck className="h-4 w-4" />}
          label="Unblock"
          variant="info"
          disabled={actionInProgress === userId}
        />
      )}
      <ActionButton
        onClick={() => handleDeleteUser(userId)}
        icon={<Trash2 className="h-4 w-4" />}
        label="Delete"
        variant="danger"
        disabled={actionInProgress === userId}
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section with Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4 lg:mb-0">User Management</h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExporting || filteredUsers.length === 0}
                  className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ease-in-out ${
                    exportSuccess
                      ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
                      : filteredUsers.length === 0
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[120px] sm:min-w-[140px]`}
                >
                  {exportSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Exported!
                    </>
                  ) : (
                    <>
                      <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                      {isExporting ? 'Exporting...' : 'Export Data'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Users', value: users.length },
                { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
                { label: 'Pending Approval', value: users.filter(u => u.status === 'pending').length },
                { label: 'Blocked Users', value: users.filter(u => u.status === 'blocked').length }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as UserType)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="institutes">Institutes</option>
                <option value="donors">Donors</option>
                <option value="shopkeepers">Shopkeepers</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <UserTable 
                users={filteredUsers}
                onApprove={handleApproveUser}
                onBlock={handleBlockUser}
                onUnblock={handleUnblockUser}
                onDelete={handleDeleteUser}
                renderActions={renderActionButtons}
                actionInProgress={actionInProgress}
              />
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} total users
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagementPage;