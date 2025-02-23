import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/Sidebar';
import HeaderAdmin from '../dashboard/HeadAdmin';
import { MainProfile } from '../dashboard/MainProfile';
import { Edit, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  citizen_id: string;
  created_at: string;
  updated_at: string;
  bond_status: {
    status: string;
    start_date: string;
    end_date: string;
  };
  company: string;
  email: string;
  phone: string;
}

const DataBondTrade: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showMainProfile, setShowMainProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.get<User[]>('http://localhost:3000/api/user/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch user data. Please try again later.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const formatDateToThai = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', options);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesStatus = statusFilter === 'all' || user.bond_status.status === statusFilter;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleViewUserDetails = (user: User) => {
    setSelectedCustomer(user);
    setShowMainProfile(true);
  };

  const handleCloseMainProfile = () => {
    setShowMainProfile(false);
    setSelectedCustomer(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto">
        <HeaderAdmin toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
        <div className="flex-1 overflow-y-auto bg-white mt-2 ml-2 border-t border-gray-200 p-8 rounded-tl-lg h-full">
          <div className="flex justify-between mb-4 border-b pb-7">
            <h1 className="text-2xl font-semibold text-gray-700">รายชื่อผู้ค้าตราสารหนี้</h1>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ค้นหา..."
                className="border border-gray-300 p-2 pl-4 rounded-[20px] shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className={`px-4 py-2 rounded-[20px] transition-colors duration-200 ease-in-out ${statusFilter === 'active' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white hover:bg-gray-300'
                  }`}
                onClick={() => handleStatusFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 rounded-[20px] transition-colors duration-200 ease-in-out ${statusFilter === 'inactive' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white hover:bg-gray-300'
                  }`}
                onClick={() => handleStatusFilter('inactive')}
              >
                Inactive
              </button>
              <button
                className={`px-4 py-2 rounded-[20px] transition-colors duration-200 ease-in-out ${statusFilter === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white hover:bg-gray-300 text-white'
                  }`}
                onClick={() => handleStatusFilter('all')}
              >
                All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">#</th>
                  <th scope="col" className="px-6 py-3">ชื่อผู้ค้า</th>
                  <th scope="col" className="px-6 py-3">เบอร์ติดต่อ</th>
                  <th scope="col" className="px-6 py-3">สถานะ</th>
                  <th scope="col" className="px-6 py-3">วันที่</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.bond_status.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user.bond_status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.bond_status.end_date ? formatDateToThai(user.bond_status.end_date) : 'ยังไม่ได้รับสถานะ'}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">{`หน้า ${currentPage} จาก ${totalPages}`}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>

      {showMainProfile && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
          <MainProfile
            userData={selectedCustomer}
            onClose={handleCloseMainProfile}
            className="bg-white rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default DataBondTrade;