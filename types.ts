
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  WIN_LEVEL = 'WIN_LEVEL',
  LOSE_LEVEL = 'LOSE_LEVEL',
  GAME_OVER = 'GAME_OVER'
}

export interface LevelInfo {
  id: number;
  title: string;
  duration: number;
  failTip: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: "SMS แปลกปลอม",
    duration: 10,
    failTip: "ธนาคารจะไม่มีการแนบลิงก์ขอข้อมูลส่วนตัวหรือรหัสผ่านผ่าน SMS"
  },
  {
    id: 2,
    title: "กล่องพัสดุ",
    duration: 10,
    failTip: "ทำลายชื่อ ที่อยู่ และเบอร์โทรศัพท์บนกล่องพัสดุก่อนทิ้งเสมอ"
  },
  {
    id: 3,
    title: "ใครโทรมา?",
    duration: 8,
    failTip: "อย่ารับสายเบอร์แปลกที่ไม่รู้จัก หรืออ้างว่าเป็นเจ้าหน้าที่รัฐโดยไม่มีการนัดหมาย"
  },
  {
    id: 4,
    title: "นัดเจอคนแปลกหน้า",
    duration: 8,
    failTip: "อย่าไปพบคนแปลกหน้าในที่ลับตาคนเพียงลำพัง หรือควรนัดในที่สาธารณะ"
  }
];
