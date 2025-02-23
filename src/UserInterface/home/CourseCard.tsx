import React from 'react';
import Swal from 'sweetalert2';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration_hours: number;
  start_date: string;
  thumbnail: string;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  isOutOfDate: boolean; 
}



// ฟังก์ชันสำหรับตัดข้อความ
const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick ,isOutOfDate}) => {
  // const isOutOfDate = new Date(course.start_date) < new Date();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOutOfDate) {
      onClick();
    } else {
      e.preventDefault();
      Swal.fire({
        title: 'ขออภัย',
        text: 'คอร์สนี้หมดเวลาแล้ว',
        icon: 'info',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
        background: '#f8f9fa',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
    }
  };

  return (
    <div 
      className={`course-card relative ${isOutOfDate ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick} 
      style={{ minHeight: '300px', minWidth: '300px', padding: '16px', border: '1px solid #ccc' }}
    >
      <img
        src={`http://localhost:3000/uploads/${course.thumbnail}`}
        alt="Course Thumbnail"
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        onError={(e) => {
          console.error('Error loading image:', e);
          (e.target as HTMLImageElement).src = '/path/to/fallback/image.jpg';
        }}
      />
      <h3>{truncateText(course.title, 30)}</h3>
      <p>{truncateText(course.description, 30)}</p>
      <p>ระยะเวลา: {course.duration_hours} ชั่วโมง</p>
      <p>วันที่เริ่ม: {new Date(course.start_date).toLocaleDateString('th-TH')}</p>
      
      {isOutOfDate && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span className="text-white text-2xl border p-4 font-bold">OUT COURSE</span>
        </div>
      )}
    </div>
  );
};

export default CourseCard;