import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faLightbulb, faTruckLoading, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { DashboardStats, StatCardProps } from '../dashboard/interface/incloudeInterface';

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, onViewAll }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={icon} className="text-2xl text-yellow-500" />
        <span className="ml-2 text-gray-700 font-semibold">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-4 bg-yellow-500 text-white py-1 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          View all
        </button>
      )}
    </div>
  );
};

interface StatsSectionProps {
  stats: DashboardStats;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const navigate = useNavigate();

  const handleViewAll = (category: string) => {
    navigate('/DataBondTrade', { state: { category } });
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-500 mb-4">รายงานสำหรับคุณ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={faMedal}
          title="จำนวนผู้ใช้ในระบบทั้งหมด"
          value={stats.totalDealers.toLocaleString()}
        />
        <StatCard
          icon={faLightbulb}
          title="จำนวนผู้ค้าที่ได้รับสถานะ"
          value={stats.activeDealers.toLocaleString()}
          onViewAll={() => handleViewAll('active')}
        />
        <StatCard
          icon={faTruckLoading}
          title="จำนวนผู้ค้าที่ยังไม่ได้รับสถานะ"
          value={stats.inactiveDealers.toLocaleString()}
          onViewAll={() => handleViewAll('inactive')}
        />
        <StatCard
          icon={faExclamationTriangle}
          title="จำนวนผู้ค้าที่หมดอายุ"
          value={stats.deactiveDealers.toLocaleString()}
          onViewAll={() => handleViewAll('deactive')}
        />
      </div>
    </div>
  );
};

export default StatsSection;
