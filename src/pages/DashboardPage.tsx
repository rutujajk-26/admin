import React, { useState } from 'react';
import { mockDashboardStats, mockDonationRequests } from '../data/mockData';
import { 
  DollarSign, 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  TrendingUp,
  BarChart2,
  PieChart,
  Calendar,
  ChevronRight,
  Settings,
  Target,
  CheckCircle2,
  IndianRupee
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import DonationChart from '../components/Dashboard/DonationChart';
import RecentRequests from '../components/Dashboard/RecentRequests';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigation } from '../context/NavigationContext';
import UserDistributionChart from '../components/Dashboard/UserDistributionChart';
import DonationsByTypeChart from '../components/Dashboard/DonationsByTypeChart';
import RequestTrendChart from '../components/Dashboard/RequestTrendChart';

type RequestCategory = 'all' | 'pending' | 'completed' | 'flagged';

const DashboardPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [timeRange, setTimeRange] = useState('7');
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory>('all');

  // Navigation handlers
  const handleViewAllUsers = () => setCurrentPage('users');
  const handleViewDonationDetails = () => setCurrentPage('transactions');
  const handleViewAllActivity = () => setCurrentPage('requests');

  // Modal handlers
  const handleSetGoals = () => setShowGoalsModal(true);

  // Filter requests based on selected category
  const filteredRequests = mockDonationRequests.filter(request => {
    switch (selectedCategory) {
      case 'pending':
        return request.status === 'pending';
      case 'flagged':
        return request.status === 'flagged';
      case 'completed':
        return request.status === 'completed';
      default:
        return true;
    }
  });

  // Handle card click
  const handleCardClick = (category: RequestCategory) => {
    setSelectedCategory(category);
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
              <div className="mt-2 sm:mt-0">
                <select 
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <div 
                onClick={() => handleCardClick('all')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'all' ? 'ring-2 ring-[#7C3AED]' : ''
                }`}
              >
                <StatCard 
                  title="Total Donations" 
                  value={`₹${mockDashboardStats.totalDonations.toLocaleString()}`} 
                  icon={<IndianRupee size={24} className="text-white" />}
                  color="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  change={{ value: 12, isPositive: true }}
                />
              </div>
              <div 
                onClick={() => handleCardClick('pending')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'pending' ? 'ring-2 ring-[#F59E0B]' : ''
                }`}
              >
                <StatCard 
                  title="Pending Requests" 
                  value={mockDashboardStats.pendingRequests.toString()} 
                  icon={<ClipboardList size={24} className="text-white" />}
                  color="bg-[#F59E0B] hover:bg-[#D97706]"
                  change={{ value: 5, isPositive: false }}
                />
              </div>
              <div 
                onClick={() => handleCardClick('completed')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'completed' ? 'ring-2 ring-[#059669]' : ''
                }`}
              >
                <StatCard 
                  title="Completed Requests" 
                  value={mockDashboardStats.completedRequests.toString()} 
                  icon={<CheckCircle2 size={24} className="text-white" />}
                  color="bg-[#059669] hover:bg-[#047857]"
                  change={{ value: 8, isPositive: true }}
                />
              </div>
              <div 
                onClick={() => handleCardClick('flagged')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'flagged' ? 'ring-2 ring-[#DC2626]' : ''
                }`}
              >
                <StatCard 
                  title="Flagged Requests" 
                  value={mockDashboardStats.flaggedRequests.toString()} 
                  icon={<AlertTriangle size={24} className="text-white" />}
                  color="bg-[#DC2626] hover:bg-[#B91C1C]"
                  change={{ value: 50, isPositive: false }}
                />
              </div>
            </div>

            {/* Category Title */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory === 'all' ? 'All Requests' :
                 selectedCategory === 'pending' ? 'Pending Requests' :
                 selectedCategory === 'completed' ? 'Completed Requests' :
                 'Flagged Requests'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredRequests.length} {selectedCategory !== 'all' ? selectedCategory : ''} requests
              </p>
            </div>
            
            {/* Charts Grid */}
            {selectedCategory === 'all' || selectedCategory === 'completed' ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Donation Trends</h3>
                      <button 
                        onClick={handleViewDonationDetails}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center transition-colors"
                        aria-label="View donation details"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                    <DonationChart 
                      data={mockDashboardStats.monthlyDonations} 
                      chartColors={[
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
                        '#FFEEAD', '#D4A5A5', '#9B5DE5', '#F15BB5', 
                        '#00BBF9', '#00F5D4', '#FEE440', '#FF006E'
                      ]}
                    />
                  </div>
                  
                  {selectedCategory === 'all' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">User Distribution</h3>
                        <button 
                          onClick={handleViewAllUsers}
                          className="text-teal-600 hover:text-teal-800 text-sm flex items-center transition-colors"
                          aria-label="View all users"
                        >
                          View All Users
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                      <UserDistributionChart 
                        data={{
                          institutes: mockDashboardStats.totalUsers.institutes,
                          donors: mockDashboardStats.totalUsers.donors,
                          shopkeepers: mockDashboardStats.totalUsers.shopkeepers
                        }}
                        chartColors={['#FF9F1C', '#E71D36', '#2EC4B6']}
                      />
                    </div>
                  )}
                </div>

                <div className="max-w-2xl mx-auto mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Donations by Type</h3>
                      <button 
                        onClick={handleViewDonationDetails}
                        className="text-violet-600 hover:text-violet-800 text-sm flex items-center transition-colors"
                        aria-label="View donation type details"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                    <DonationsByTypeChart 
                      chartColors={['#FF9F1C', '#E71D36', '#2EC4B6', '#7209B7', '#3A0CA3']}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {selectedCategory === 'pending' ? 'Pending Request Trends' : 'Flagged Request Trends'}
                    </h3>
                    <button 
                      onClick={() => setCurrentPage('requests')}
                      className={`${
                        selectedCategory === 'pending' ? 'text-amber-600 hover:text-amber-800' : 'text-rose-600 hover:text-rose-800'
                      } text-sm flex items-center transition-colors`}
                      aria-label={`View all ${selectedCategory} requests`}
                    >
                      View All
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                  <RequestTrendChart 
                    chartColors={selectedCategory === 'pending' ? 
                      ['#FFB703', '#FB8500', '#FF6B6B'] : 
                      ['#FF006E', '#FF5C8A', '#FF8FA3']
                    }
                  />
                </div>
              </div>
            )}

            {/* Recent Requests Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">
                    {selectedCategory === 'all' ? 'Recent Requests' :
                     `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Requests`}
                  </h3>
                  <span className="text-sm text-gray-500">({filteredRequests.length})</span>
                </div>
                <button 
                  onClick={() => setCurrentPage('requests')}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      selectedCategory === 'all' ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]' :
                      selectedCategory === 'pending' ? 'bg-[#F59E0B] text-white hover:bg-[#D97706]' :
                      selectedCategory === 'completed' ? 'bg-[#059669] text-white hover:bg-[#047857]' :
                      'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                    }
                  `}
                  aria-label={`View all ${selectedCategory} requests`}
                >
                  View All
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <RecentRequests requests={filteredRequests} />
            </div>
          </div>
        </main>
      </div>

      {/* Goals Setting Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Set Monthly Goals</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Target (₹)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter target amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Resolution Target (%)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter target percentage"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowGoalsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save goals
                  setShowGoalsModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;