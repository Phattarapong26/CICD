import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopUpProfile from './ProfileUser';
import PopUpCourseHistory from './HistoryUser';
import {CourseData,MainProfileProps } from '../dashboard/interface/incloudeInterface';

export const MainProfile: React.FC<MainProfileProps> = ({ userData, onClose }) => {
  const [showProfile, setShowProfile] = useState(true);
  const [showCourseHistory, setShowCourseHistory] = useState(false);
  const [courseData, setCourseData] = useState<CourseData[]>([]);

  useEffect(() => {
    if (showCourseHistory) {
      fetchCourseHistory();
    }
  }, [showCourseHistory]);

  const fetchCourseHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const response = await axios.get(`http://localhost:3000/api/Admin/Check/user/by/${userData.citizen_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCourseData(response.data);
    } catch (error) {
      console.error('Error fetching course history:', error)
    }
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    onClose();
  };

  const handleShowCourseHistory = () => {
    setShowProfile(false);
    setShowCourseHistory(true);
  };

  const handleCloseCourseHistory = () => {
    setShowCourseHistory(false);
    onClose();
  };

  const handleShowProfile = () => {
    setShowCourseHistory(false);
    setShowProfile(true);
  };

  return (
    <div>
      {showProfile && (
        <PopUpProfile
        data={{
          id: userData._id,
          name: userData.name,
          idCard: userData.citizen_id,
          startDate: userData.created_at,
          bond_status: {
            start_date: userData.bond_status.start_date,
            end_date: userData.bond_status.end_date,
            status: userData.bond_status.status,
          },
          profilePicture: userData.profilePicture ?? '',
          company: userData.company,
          email: userData.email,
          phone: userData.phone,
        }}
        onClose={handleCloseProfile}
        onShowHistoryCourse={handleShowCourseHistory}
      />
      )}
      {showCourseHistory && (
        <PopUpCourseHistory
          onClose={handleCloseCourseHistory}
          onShowProfile={handleShowProfile}
          userData={{
            name: userData.name,
            email: userData.email,
            _id: userData._id,
          }}
          courses={courseData.map(course => ({
            
            ...course,
          
          }))}
        />
      )}
    </div>
  );
};

export default MainProfile;