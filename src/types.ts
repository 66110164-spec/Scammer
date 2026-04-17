export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  WIN_LEVEL = 'WIN_LEVEL',
  LOSE_LEVEL = 'LOSE_LEVEL',
  GAME_OVER = 'GAME_OVER'
}

export interface LevelConfig {
  id: number;
  title: string;       
  scamType: string;    
  duration: number;
  failTip: string;
  // เพิ่มค่าที่คุณใช้ใน levels.ts เข้าไปที่นี่
  gameType: 'SPECIAL' | 'CHOICE' | 'CHAT' | 'LINK' | 'DECISION'; 
  content?: {          
    question: string;
    choices: { text: string; isCorrect: boolean; feedback: string }[];
  };
}