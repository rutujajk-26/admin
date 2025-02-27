import React, { useState } from 'react';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';

interface Transaction {
  id: string;
  date: string;
  user: string;
  type: 'donation' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: 'TRX001',
    date: '2025-02-27',
    user: 'John Doe',
    type: 'donation',
    amount: 1000,
    status: 'completed'
  },
  {
    id: 'TRX002',
    date: '2025-02-26',
    user: 'Jane Smith',
    type: 'withdrawal',
    amount: 500,
    status: 'pending'
  },
  {
    id: 'TRX003',
    date: '2025-02-25',
    user: 'Alice Johnson',
    type: 'donation',
    amount: 2500,
    status: 'completed'
  },
  {
    id: 'TRX004',
    date: '2025-02-24',
    user: 'Bob Wilson',
    type: 'withdrawal',
    amount: 750,
    status: 'failed'
  },
  {
    id: 'TRX005',
    date: '2025-02-23',
    user: 'Emma Davis',
    type: 'donation',
    amount: 3000,
    status: 'completed'
  },
  {
    id: 'TRX006',
    date: '2025-02-22',
    user: 'Michael Brown',
    type: 'donation',
    amount: 1500,
    status: 'pending'
  },
  {
    id: 'TRX007',
    date: '2025-02-21',
    user: 'Sarah Miller',
    type: 'withdrawal',
    amount: 1000,
    status: 'completed'
  },
  {
    id: 'TRX008',
    date: '2025-02-20',
    user: 'David Clark',
    type: 'donation',
    amount: 5000,
    status: 'completed'
  }
];

const TransactionsPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 5;

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Helper function to check if a date is within the current week
  const isWithinLastWeek = (date: Date) => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return date >= weekAgo && date <= today;
  };

  // Helper function to check if a date is within the current month
  const isWithinCurrentMonth = (date: Date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const txDate = new Date(transaction.date);
    const today = new Date();

    // Search filter
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      switch(dateFilter) {
        case 'today':
          matchesDate = isSameDay(txDate, today);
          break;
        case 'week':
          matchesDate = isWithinLastWeek(txDate);
          break;
        case 'month':
          matchesDate = isWithinCurrentMonth(txDate);
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, statusFilter, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle export
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Format the date in a readable way
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      // Format amount with currency
      const formatAmount = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
      };

      // Prepare CSV content with proper formatting
      const csvContent = [
        ['Transaction ID', 'Date & Time', 'User Name', 'Transaction Type', 'Amount (₹)', 'Status'],
        ...filteredTransactions.map(t => [
          t.id,
          formatDate(t.date),
          t.user,
          t.type.charAt(0).toUpperCase() + t.type.slice(1),
          formatAmount(t.amount),
          t.status.charAt(0).toUpperCase() + t.status.slice(1)
        ])
      ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

      // Create and download the file
      const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `transactions_${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
      notification.textContent = 'Export failed. Please try again.';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 w-full max-w-[1400px] mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage all financial transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">₹45,678</p>
            <p className="mt-1 text-sm text-green-600">+12.5% from last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-medium text-gray-500">Total Donations</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">₹32,456</p>
            <p className="mt-1 text-sm text-green-600">+8.2% from last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-medium text-gray-500">Total Withdrawals</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">₹13,222</p>
            <p className="mt-1 text-sm text-red-600">-2.4% from last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-medium text-gray-500">Pending Transactions</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">12</p>
            <p className="mt-1 text-sm text-yellow-600">Requires attention</p>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 sm:min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <select
                  className="w-full sm:w-auto border rounded-lg px-4 py-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">This Month</option>
                </select>
                <select
                  className="w-full sm:w-auto border rounded-lg px-4 py-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button 
                onClick={handleExport}
                disabled={isExporting || filteredTransactions.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] transition-colors duration-200"
              >
                <Download size={20} />
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.user}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`capitalize ${
                              transaction.type === 'donation' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{transaction.amount.toLocaleString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
                </span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsPage; 