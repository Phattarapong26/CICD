import React from 'react';

interface NavItem {
  icon: string;
  text: string;
  active?: boolean;
  hasDropdown?: boolean;
}

const navItems: NavItem[] = [
  { icon: 'fa-home', text: 'หน้าแรก', active: true },
  { icon: 'fa-book', text: 'หลักสูตร', hasDropdown: true },
  { icon: 'fa-info-circle', text: 'เกี่ยวกับเรา' },
  { icon: 'fa-question-circle', text: 'คำถามที่พบบ่อย' },
  { icon: 'fa-check-circle', text: 'ตรวจสอบใบวุฒิบัตร' },
  { icon: 'fa-font', text: 'คำศัพท์' }
];

const Sidebar: React.FC = () => (
  <aside className="w-60 h-full p-6 fixed shadow-md">
    <div className="flex items-center mb-6">
      <img src="https://placehold.co/50x50" alt="SET Logo" className="h-8"/>
    </div>
    <nav>
      <ul>
        {navItems.map((item, index) => (
          <li key={index} className="mb-4">
            <a href="#" className={`flex items-center ${item.active ? 'text-orange-500' : ''}`}>
              <i className={`fas ${item.icon} mr-2`}></i> {item.text}
              {item.hasDropdown && <i className="fas fa-chevron-down ml-auto"></i>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <div className="absolute bottom-4 left-4 text-xs text-gray-500">
      <p>ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์</p>
      <p>การคุ้มครองข้อมูลส่วนบุคคล</p>
      <p>นโยบายการใช้คุกกี้</p>
      <p>© สงวนลิขสิทธิ์ 2567 ตลาดหลักทรัพย์แห่งประเทศไทย</p>
    </div>
  </aside>
);

export default Sidebar;