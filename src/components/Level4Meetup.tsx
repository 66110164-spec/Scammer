
import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, User, ShieldCheck, ShieldX } from 'lucide-react';

interface Level4Props {
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
}

const MESSAGES = [
  "เราคุยกันมาสักพักแล้ว เย็นนี้สะดวกมาเจอกันหน่อยไหม? เราอยากเจอตัวจริง",
  "วันนี้ว่างไหม? เรามีของขวัญจะให้ มาเจอกันตามพิกัดนี้หน่อยสิ",
  "สะดวกมาเจอกันไหม? เราอยากคุยธุระด้วยแบบเห็นหน้า มาหาเราที่นี่หน่อยนะ",
  "เรามีเรื่องสำคัญจะบอกต่อหน้า มาเจอกันตามโลเคชั่นนี้เลย"
];

const LOCATIONS = [
  "สวนสาธารณะท้ายซอย",
  "ตึกร้างข้างโรงเรียน",
  "ซอยเปลี่ยวหลังวัด",
  "ลานจอดรถใต้ดิน"
];

const Level4Meetup: React.FC<Level4Props> = ({ onWin, onLose, timeLeft }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [scamMessage, setScamMessage] = useState("");
  const [scamLocation, setScamLocation] = useState("");

  useEffect(() => {
    setScamMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    setScamLocation(LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]);
    
    const timer = setTimeout(() => setShowButtons(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onLose();
    }
  }, [timeLeft, onLose]);

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="bg-white rounded-3xl p-4 border-4 border-[#15173D] shadow-lg flex-1 flex flex-col">
        <div className="flex items-center space-x-3 border-b-2 border-gray-100 pb-3 mb-4">
          <div className="bg-[#E491C9] p-2 rounded-full border-2 border-[#15173D]">
            <User size={24} className="text-[#15173D]" />
          </div>
          <div>
            <p className="font-black text-[#15173D] text-sm">เพื่อนใหม่ (ออนไลน์)</p>
            <p className="text-[10px] text-green-500 font-bold uppercase">กำลังใช้งาน</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {scamMessage && (
            <div className="flex justify-start animate-in slide-in-from-left duration-300">
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                <p className="text-xs font-bold text-[#15173D]">{scamMessage}</p>
              </div>
            </div>
          )}
          
          {scamLocation && (
            <div className="flex justify-start animate-in slide-in-from-left duration-300 delay-700 fill-mode-both">
              <div className="bg-[#982598]/10 rounded-2xl rounded-tl-none p-3 max-w-[80%] border-2 border-dashed border-[#982598]/30 flex items-center space-x-2">
                <MapPin size={16} className="text-[#982598]" />
                <p className="text-[10px] font-black text-[#982598]">แชร์ตำแหน่งที่ตั้ง: {scamLocation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button 
          onClick={onLose}
          className="bg-[#15173D] text-white p-6 rounded-2xl font-black flex flex-col items-center justify-center hover:bg-[#982598] transition-colors shadow-lg"
        >
          <span className="text-base">ไปตามนัด</span>
        </button>
        
        <button 
          onClick={onWin}
          className="bg-[#15173D] text-white p-6 rounded-2xl font-black flex flex-col items-center justify-center hover:bg-[#982598] transition-colors shadow-lg"
        >
          <span className="text-base">ไม่ไปดีกว่า</span>
        </button>
      </div>
    </div>
  );
};

export default Level4Meetup;
