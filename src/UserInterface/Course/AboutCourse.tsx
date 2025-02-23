import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCertificate, faShare, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Sidebar from '../../Components/SidebarUser';
import Header from '../../Components/Head';
import { faUser } from '@fortawesome/free-solid-svg-icons';


interface Course {
  _id: string;
  title: string;
  description: string;
  details: string;
  duration_hours: number;
  trainingLocation: string;
  max_seats: number;
  start_date: string;
  thumbnail: string;
  video: string;
  qr_code: string; // Add this line
  status?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}


const AboutCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEnrollments, setCurrentEnrollments] = useState(0);
  const [courseStatus, setCourseStatus] = useState<string | null>(null);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const checkEnrollmentStatus = useCallback(async (courseId: string) => {
    try {
      const response = await axiosInstance.get(`/User/check/enrollment-status/${courseId}`);
      setIsEnrolled(response.data.isEnrolled);
      setCurrentEnrollments(response.data.currentEnrollments);
      setCourseStatus(response.data.courseStatus);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('Enrollment status endpoint not found. Falling back to user courses check.');
        const userCoursesResponse = await axiosInstance.get(`/user/check/HistoryCourse/${user?._id}`);
        const userCourses = userCoursesResponse.data;
        setIsEnrolled(userCourses.some((course: any) => course._id === courseId));
        // Note: We can't determine currentEnrollments this way, so we'll leave it as is
      } else {
        console.error('Error checking enrollment status:', error);
      }
    }
  }, [axiosInstance, user]);

  const handleCancelEnrollment = async () => {
    if (!user || !course) {
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'ยืนยันการยกเลิกการลงทะเบียน',
        text: 'คุณแน่ใจหรือไม่ที่จะยกเลิกการลงทะเบียนในหลักสูตรนี้?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(`/User/cancel-enrollment/${course._id}`);
        setIsEnrolled(false);
        setCurrentEnrollments(response.data.currentEnrollments);

        Swal.fire({
          icon: 'success',
          title: 'ยกเลิกการลงทะเบียนสำเร็จ',
          text: 'คุณได้ยกเลิกการลงทะเบียนในหลักสูตรนี้แล้ว'
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          const errorMessage = error.response?.data?.message || 'ไม่สามารถยกเลิกการลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง';
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: errorMessage
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถยกเลิกการลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง'
        });
      }
    }
  };
  useEffect(() => {
    const fetchUserAndCourse = async () => {
      try {
        const [userResponse, courseResponse] = await Promise.all([
          axiosInstance.get<User>('/user'),
          axiosInstance.get<Course>(`courses/${id}`),
        ]);
        setUser(userResponse.data);
        setCourse(courseResponse.data);
        if (courseResponse.data) {
          await checkEnrollmentStatus(courseResponse.data._id);
        } else {
          console.error('Course data is null');
          Swal.fire('Error', 'Failed to fetch course details', 'error');
        }
      } catch (error) {
        console.error('Error fetching user or course:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (axios.isAxiosError(error) && error.response?.status === 404) {
          Swal.fire('Error', 'Course not found', 'error');
          navigate('/courses');
        } else {
          Swal.fire('Error', 'Failed to fetch user or course details', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCourse();
  }, [id, navigate, axiosInstance, checkEnrollmentStatus]);

  const handleRegister = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนลงทะเบียนเรียน',
        showCancelButton: true,
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    if (!course) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่พบข้อมูลคอร์ส กรุณาลองใหม่อีกครั้ง'
      });
      return;
    }

    if (currentEnrollments >= course.max_seats) {
      Swal.fire({
        icon: 'error',
        title: 'จำนวนที่นั่งเต็มแล้ว',
        text: 'ขออภัย จำนวนที่นั่งในหลักสูตรนี้เต็มแล้ว'
      });
      return;
    }

    try {
      await axiosInstance.post(`/user/RegisterCourses/${course._id}/enroll`, {
        userId: user._id
      });
      setIsEnrolled(true);
      setCurrentEnrollments(prev => prev + 1);
      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จ',
        text: 'คุณได้ลงทะเบียนเรียนในหลักสูตรนี้แล้ว'
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response?.status === 409) {
          setIsEnrolled(true);
          Swal.fire({
            icon: 'info',
            title: 'คุณลงทะเบียนไว้แล้ว',
            text: 'คุณได้ลงทะเบียนในหลักสูตรนี้ไว้แล้ว'
          });
        } else {
          const errorMessage = error.response?.data?.message || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง';
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: errorMessage
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง'
        });
      }
    }
  };


  const handleStartLearning = () => {
    if (course && course.qr_code) {
      Swal.fire({
        title: 'Scan QR Code to Start Learning',
        imageUrl: `http://localhost:3000/uploads/${course.qr_code}`,
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: 'Course QR Code',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'QR Code Not Available',
        text: 'Sorry, the QR code for this course is not available.',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto">
        <Header
          toggleDropdown={toggleDropdown}
          dropdownOpen={dropdownOpen}
        />
        <div className="w-full mx-auto p-9 ml-3 rounded-lg mt-3 bg-white shadow-md rounded-lg border">
          <div className="bg-black shadow-md rounded-lg p-6 flex">
            <div className="w-2/3 pr-6">
              <h1 className="text-gray-500 text-sm">{course._id}</h1>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                {course.title}
              </h2>
              <p className="text-white mb-4">
                {course.description}
              </p>
            </div>
            <div className="w-1/3 bg-white shadow-md rounded-lg p-4">
              <video
                src={`http://localhost:3000/uploads/${course.video}`}
                controls
                className="w-full rounded" />
              <div className="text-center mb-4">
                <span className="text-green-500 text-xl">ฟรี</span>
              </div>
              {isEnrolled && courseStatus === "completed" ? (
                <button disabled className="bg-gray-500 text-white w-full py-2 rounded-md mb-4 cursor-not-allowed">
                  สำเร็จคอร์สเรียนนี้แล้ว
                </button>
              ) : isEnrolled && course.status !== "completed" ? (
                <div className="space-y-2">
                  <button onClick={handleStartLearning} className="bg-green-500 text-white w-full py-2 rounded-md">
                    เริ่มเรียน
                  </button>
                  <button onClick={handleCancelEnrollment} className="bg-red-500 text-white w-full py-2 rounded-md">
                    ยกเลิกการลงทะเบียน
                  </button>
                </div>
              ) : currentEnrollments >= course.max_seats ? (
                <button disabled className="bg-gray-500 text-white w-full py-2 rounded-md mb-4 cursor-not-allowed">
                  จำนวนที่นั่งเต็มแล้ว
                </button>
              ) : (
                <button onClick={handleRegister} className="bg-orange-500 text-white w-full py-2 rounded-md mb-4">
                  ลงทะเบียน
                </button>
              )}
              <ul className="text-gray-700">
                <li className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> {course.duration_hours} ชั่วโมงการเรียน
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faCertificate} className="mr-2" /> วุฒิบัตร
                </li>
                <li className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> {currentEnrollments}/{course.max_seats} ที่นั่ง
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">คำอธิบายหลักสูตร</h3>
              <p className="text-gray-700">
                {course.description}
              </p>
            </div>
            <div className="border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">รายละเอียด</h3>
              <p className="text-gray-700">
                {course.details}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-2">ข้อมูลเพิ่มเติม</h3>
              <p className="text-gray-700">
                จำนวนที่นั่งสูงสุด: {course.max_seats}<br />
                วันที่เริ่ม: {new Date(course.start_date).toLocaleDateString('th-TH')}
              </p>
            </div>
            <div className="border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-bold text-orange-500 mb-2">สถานที่จัดอบรม</h3>
              <p className="text-gray-700">
                {course.trainingLocation}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutCourse;