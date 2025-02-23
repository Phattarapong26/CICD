import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Save, X } from 'lucide-react';

const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  coursesEndpoint: '/api/Admin/UpdateDetail/courses',
};

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: CourseData) => void;
  course: CourseData;
  jwtToken?: string | null; 
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  details: string;
  duration_hours: number;
  max_seats: number;
  start_date: string;
  thumbnail: string | File;
  video: string | File;
  trainingLocation: string; 
  qr_code: string | File; // Add QR code field
}


const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, onSubmit, course }) => {
  const [courseData, setCourseData] = useState<CourseData>(course);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  useEffect(() => {
    setCourseData(course);
  }, [course]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setCourseData(prevData => ({ ...prevData, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        throw new Error('ไม่พบโทเค็นการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่');
      }

      const formData = new FormData();
      Object.entries(courseData).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.put(`${API_CONFIG.baseUrl}${API_CONFIG.coursesEndpoint}/${courseData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      onSubmit(response.data);
      onClose();
      Swal.fire({
        icon: 'success',
        title: 'แก้ไขคอร์สสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload();
        }
      });
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('การตรวจสอบสิทธิ์ล้มเหลว กรุณาเข้าสู่ระบบใหม่');
        } else {
          setError(`เกิดข้อผิดพลาด: ${err.response?.status} ${err.response?.statusText}`);
        }
        console.error('Error updating course:', err.response?.data);
      } else if (err instanceof Error) {
        setError(err.message);
        console.error('Unexpected error:', err);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง');
        console.error('Unknown error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">แก้ไขคอร์ส</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">ชื่อคอร์ส</label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบายคอร์ส</label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">รายละเอียดคอร์ส</label>
              <textarea
                id="details"
                name="details"
                value={courseData.details}
                onChange={handleInputChange}
                required
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="trainingLocation" className="block text-sm font-medium text-gray-700">สถานที่อบรม</label>
              <input
                type="text"
                id="trainingLocation"
                name="trainingLocation"
                value={courseData.trainingLocation}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700">ระยะเวลาคอร์ส (ชั่วโมง)</label>
                <input
                  type="number"
                  id="duration_hours"
                  name="duration_hours"
                  value={courseData.duration_hours}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="max_seats" className="block text-sm font-medium text-gray-700">จำนวนที่นั่งสูงสุด</label>
                <input
                  type="number"
                  id="max_seats"
                  name="max_seats"
                  value={courseData.max_seats}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">วันที่เริ่มคอร์ส</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={courseData.start_date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">อัพโหลดรูปภาพหน้าปก (ถ้าต้องการเปลี่ยน)</label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              />
            </div>
            <div>
              <label htmlFor="video" className="block text-sm font-medium text-gray-700">อัพโหลดวิดีโอ (ถ้าต้องการเปลี่ยน)</label>
              <input
                type="file"
                id="video"
                name="video"
                onChange={handleFileChange}
                accept="video/*"
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              />
            </div>
            <div>
            <label htmlFor="qr_code" className="block text-sm font-medium text-gray-700">อัพโหลด QR Code (ถ้าต้องการเปลี่ยน)</label>
            <input
              type="file"
              id="qr_code"
              name="qr_code"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            />
          </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.659A8 8 0 0112 4v8h8a8 8 0 01-8 8v-4z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  บันทึก
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
