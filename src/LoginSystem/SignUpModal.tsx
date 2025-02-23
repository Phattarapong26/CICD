interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    company: string;
    setCompany: (company: string) => void;
    citizenId: string;
    setCitizenId: (citizenId: string) => void;
    phone: string;
    setPhone: (phone: string) => void;
    handleSignUp: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// ส่วนของ SignUpModal component ที่ render form
const SignUpModal: React.FC<SignUpModalProps> = ({
    isOpen,
    onClose,
    name, setName,
    email, setEmail,
    company, setCompany,
    citizenId, setCitizenId,
    phone, setPhone,
    handleSignUp,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    สมัครสมาชิก
                </h2>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">บริษัท</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">เลขบัตรประชาชน</label>
                        <input
                            type="text"
                            value={citizenId}
                            onChange={(e) => {
                                // อนุญาตให้กรอกได้เฉพาะตัวเลขและไม่เกิน 13 หลัก
                                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                                setCitizenId(value);
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            required
                            pattern="\d{13}"
                            title="กรุณากรอกเลขบัตรประชาชน 13 หลัก"
                            placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">อีเมล</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">เบอร์โทรศัพท์</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                            required
                            pattern="[0-9]{10}"
                            title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            สมัครสมาชิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SignUpModal;