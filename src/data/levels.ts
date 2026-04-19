import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "SMS แปลกปลอม",
    scamType: "Phishing Link",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ธนาคารจะไม่แนบลิงก์ขอข้อมูลส่วนตัวผ่าน SMS"
  },
  {
    id: 2,
    title: "กล่องพัสดุ",
    scamType: "Data Leakage",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ทำลายชื่อ ที่อยู่ บนกล่องพัสดุก่อนทิ้งเสมอ"
  },
  {
    id: 3,
    title: "ใครโทรมา?",
    scamType: "Call Center Scam",
    gameType: 'SPECIAL',
    duration: 8,
    failTip: "อย่ารับสายเบอร์แปลกที่อ้างว่าเป็นเจ้าหน้าที่รัฐ"
  },
  {
    id: 4,
    title: "นัดเจอคนแปลกหน้า",
    scamType: "Physical Danger",
    gameType: 'SPECIAL',
    duration: 8,
    failTip: "อย่าไปพบคนแปลกหน้าในที่ลับตาคนเพียงลำพัง"
  },

{
    id: 5,
    title: "ฟังเพลงรับเงิน (กับดักโอนก่อน)",
    scamType: "งานออนไลน์หลอกลวง",
    gameType: 'SPECIAL',
    duration: 8, // ให้เวลาน้อยหน่อยเพื่อความตื่นเต้น
    failTip: "ไม่มีงานไหนที่ต้องให้เราโอนเงินไปให้ก่อนเพื่อรับเงิน ใครบอกให้โอนก่อน = มิจฉาชีพ 100%!"
  },
  {
    id: 6,
    title: "กดไลค์ รับเงิน (VIP ลวงโลก)",
    scamType: "Social Media Scam",
    gameType: 'SPECIAL',
    duration: 10, // ปรับเวลาได้ตามความเหมาะสม
    failTip: "เติมแล้วงานหาย เหมียว! การโอนเงินเพื่ออัปเกรด VIP บนโซเชียลคือกับดักมิจฉาชีพ 100%"
  },
  {
    id: 7,
    title: "ออเดอร์ทิพย์",
    scamType: "Online Shopping Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ร้านค้าออนไลน์ไม่มีนโยบายให้โอนเงินมัดจำเพื่อยืนยันออเดอร์!"
  },
  {
    id: 8,
    title: "กล่องพัสดุ งานทิพย์",
    scamType: "Job Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "การทำงานที่ต้องจ่ายค่าอุปกรณ์ก่อน คือสัญญาณเตือนภัยมิจฉาชีพ!"
  },
  {
    id: 9,
    title: "รับจ้างเปิดบัญชีม้า",
    scamType: "Money Mule",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "รับจ้างเปิดบัญชีหรือให้ยืมบัตร คือความผิดทางกฎหมาย มีโทษติดคุกหนัก!"
  },
  {
    id: 10,
    title: "ซิมการ์ดลวงโลก",
    scamType: "Data Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ห้ามลงทะเบียนซิมชื่อเราให้คนอื่นเด็ดขาด เพราะมิจฉาชีพจะเอาไปใช้ก่อคดี"
  },
  {
    id: 11,
    title: "หน้าใส...ใจโจร",
    scamType: "Identity Theft",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "อย่าสแกนใบหน้าแลกของฟรีหรือเงินเด็ดขาด! นี่คือการขโมยข้อมูลอัตลักษณ์"
  },
  {
    id: 12,
    title: "นรกคอลเซนเตอร์",
    scamType: "Trafficking Scam",
    gameType: 'SPECIAL',
    duration: 12,
    failTip: "ระวังงานต่างประเทศรายได้ดีเกินจริง ส่วนใหญ่มักเป็นกับดักค้ามนุษย์"
  },
  {
    id: 13,
    title: "คริปโตตัวแสบ",
    scamType: "Investment Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "กำไรสูงเกินจริงในเวลาสั้นๆ ไม่มีอยู่จริง อย่าเสี่ยงโอนเงินลงทุนเด็ดขาด"
  },
  {
    id: 14,
    title: "รักลวงตา (Romance Scam)",
    scamType: "Romance Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "คนแปลกหน้าในแอปหาคู่มักใช้รูปปลอมมาหลอกให้เราโอนเงิน!"
  },
  {
    id: 15,
    title: "ตำรวจปลอมโทรขู่",
    scamType: "Impersonation Scam",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ตำรวจจริงไม่โทรมาขู่ให้โอนเงินตรวจสอบเด็ดขาด!"
  },
  {
    id: 16,
    title: "บัตรประชาชนเลขลับ",
    scamType: "Data Privacy",
    gameType: 'SPECIAL',
    duration: 8,
    failTip: "เลขบัตรประชาชน 13 หลักคือข้อมูลลับ ห้ามเปิดเผยให้ใครเด็ดขาด"
  },
  {
    id: 17,
    title: "อย่าแชร์โลเคชั่น",
    scamType: "Privacy Protection",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "การแชร์ตำแหน่งที่อยู่จริงให้คนแปลกหน้า อาจนำอันตรายมาสู่ตัวคุณ"
  },
  {
    id: 18,
    title: "โพสต์เบอร์ประจาน",
    scamType: "Privacy Protection",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ห้ามโพสต์เบอร์โทรศัพท์หรือข้อมูลส่วนตัวในที่สาธารณะเด็ดขาด!"
  },
  {
    id: 19,
    title: "เปิดสาธารณะระวังภัย",
    scamType: "Privacy Protection",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "ตั้งค่าความเป็นส่วนตัวในโซเชียลให้รัดกุม ป้องกันคนแปลกหน้าเข้าถึงข้อมูล"
  },
  {
id: 20,
    title: "บัตรนักเรียน QR Code",
    scamType: "Data Leakage",
    gameType: 'SPECIAL',
    duration: 10,
    failTip: "การเปิดเผย QR Code บนบัตรนักเรียน = การเปิดเผยข้อมูลส่วนตัวให้มิจฉาชีพ!" // <--- แก้ไขคำตรงนี้ได้เลย
  },
];