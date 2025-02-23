import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCertificate, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../Components/Sidebar';
import HeaderAdmin from '../dashboard/HeadAdmin';
import CheckName from '../CourseRoadMAP/checkName';
import { Course,User} from '../dashboard/interface/incloudeInterface';

const AboutCourseAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolledUsers, setEnrolledUsers] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckName, setShowCheckName] = useState(false);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleCheckName = () => setShowCheckName(!showCheckName);

  useEffect(() => {
    const fetchCourseAndEnrollments = async () => {
      try {
        const [courseResponse, usersResponse] = await Promise.all([
          axiosInstance.get<Course>(`/courses/${id}`), 
          axiosInstance.get<User[]>(`/v1/user/courses/${id}`)
        ]);
        setCourse(courseResponse.data);
        const enrolledCount = usersResponse.data.filter(user => 
          user.courses_enrolled.some(course => course.course_id === id)
        ).length;
        setEnrolledUsers(enrolledCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch course details', 'error');
        navigate('/admin/courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndEnrollments();
  }, [id, navigate, axiosInstance]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const availableSeats = course.max_seats - enrolledUsers;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto">
        <HeaderAdmin
          toggleDropdown={toggleDropdown}
          dropdownOpen={dropdownOpen}
        />
        <div className="w-full mx-auto p-6 ml-3 mt-3 bg-white shadow-md rounded-lg border">
          <div className="bg-gray-800 shadow-md rounded-lg p-6 flex">
            <div className="w-2/3 pr-6">
              <h1 className="text-gray-400 text-sm">{course._id}</h1>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                {course.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {course.description}
              </p>
            </div>
            <div className="w-1/3 bg-white shadow-md rounded-lg p-4">
              <video
                src={`http://localhost:3000/uploads/${course.video}`}
                controls
                className="w-full rounded mb-4"
              />
              <ul className="text-gray-700">
                <li className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> {course.duration_hours} ชั่วโมงการเรียน
                </li>
                <li className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faCertificate} className="mr-2" /> วุฒิบัตร
                </li>
                <li className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> {enrolledUsers}/{course.max_seats} ที่นั่ง
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">รายละเอียดหลักสูตร</h3>
              <p className="text-gray-700">
                {course.details}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ข้อมูลเพิ่มเติม</h3>
              <p className="text-gray-700">
                จำนวนที่นั่งสูงสุด: {course.max_seats}<br />
                จำนวนผู้ลงทะเบียน: {enrolledUsers}<br />
                จำนวนที่นั่งว่าง: {availableSeats}<br />
                วันที่เริ่ม: {new Date(course.start_date).toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
          
          {/* Button to open CheckName pop-up */}
          <div className="mt-6">
            <button
              onClick={toggleCheckName}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              แสดงรายชื่อผู้เข้าอบรม
            </button>
          </div>

          {/* CheckName pop-up */}
          {showCheckName && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-3/4 max-w-3xl max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={toggleCheckName}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <CheckName course={course} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AboutCourseAdmin;