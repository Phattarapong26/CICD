import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { Course, HistoryCourseProps } from '../dashboard/interface/incloudeInterface';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PopUpCourseHistory: React.FC<HistoryCourseProps> = ({ onClose, onShowProfile, userData, courses: initialCourses }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    fetchCourseHistory();
  }, []);

  const fetchCourseHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.get(`http://localhost:3000/api/Admin/Check/user/HistoryCourses/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching course history:', error.response?.data || error.message);
        alert(`Failed to fetch course history: ${error.response?.data?.message || error.message}`);
      } else {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' ||
      (filter === 'ongoing' && course.status === 'ongoing') ||  // ตรวจสอบให้ตรงกับ status ที่ส่งมา
      (filter === 'completed' && course.status === 'completed'))           // ตรวจสอบให้ตรงกับ status ที่ส่งมา
  );
  const handlePersonalInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowProfile();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-lg mt-28 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl">
          <i className="fas fa-user"></i>
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-bold">{userData.name}</h1>
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>
      <div className="md:flex space-x-4 mb-6 hidden">
        <a href="#" className="text-gray-600 hover:text-black" onClick={handlePersonalInfoClick}>ข้อมูลส่วนตัว</a>
        <a href="#" className="text-orange-500 border-b-2 border-orange-500">หลักสูตรของฉัน</a>
      </div>
      <div className="md:hidden mb-6">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 hover:text-black">
          <i className="fas fa-bars"></i>
        </button>
        {menuOpen && (
          <div className="flex flex-col space-y-2 mt-2">
            <a href="#" className="text-gray-600 hover:text-black" onClick={handlePersonalInfoClick}>ข้อมูลส่วนตัว</a>
            <a href="#" className="text-orange-500 border-b-2 border-orange-500">หลักสูตรของฉัน</a>
          </div>
        )}
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">หลักสูตรของฉัน</h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="ค้นหาหลักสูตรของฉัน"
            className="flex-grow p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="ml-2 p-2 bg-gray-200 rounded-lg" onClick={() => setSearchTerm('')}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            className={`flex items-center space-x-2 ${filter === 'all' ? 'text-black' : 'text-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            <span>ทั้งหมด</span>
          </button>
          <button
            className={`flex items-center space-x-2 ${filter === 'ongoing' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-600'}`}
            onClick={() => setFilter('ongoing')}
          >
            <span>ยังไม่ได้เรียน</span>
            <span className="bg-red-500 text-white rounded-full px-2">{courses.filter(course => course.status === 'ongoing').length}</span>
          </button>
          <button
            className={`flex items-center space-x-2 ${filter === 'completed' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'}`}
            onClick={() => setFilter('completed')}
          >
            <span>เรียนจบแล้ว</span>
            <span className="bg-green-500 text-white rounded-full px-2">{courses.filter(course => course.status === 'completed').length}</span>
          </button>
        </div>
        <div className="space-y-4" style={{
          maxHeight: '300px',
          overflowY: 'auto',
          minHeight: '300px',
          minWidth: '700px'
        }}>
          {filteredCourses.map(course => (
            <div key={course._id} className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow">
              <img src={`http://localhost:3000/uploads/${course.thumbnail}`} alt="Course thumbnail" className="w-30 h-24 rounded-lg mr-4 mb-4 md:mb-0" />
              <div className="flex-grow">
                <p className="text-gray-600">{course.title}</p>
                <p className="text-gray-600">วันลงทะเบียน: {formatDate(course.registrationDate)}</p>
                <p className={`text-${course.status === 'completed' ? 'green' : course.status === 'ongoing' ? 'red' : 'red'}-500`}>สถานะ: {course.status === 'completed' ? 'เรียนจบแล้ว' : 'ยังไม่ได้เรียน'} </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-gray-600">ทั้งหมด {filteredCourses.length} รายการ</div>
      </div>
    </div>
  );
};

export default PopUpCourseHistory;
