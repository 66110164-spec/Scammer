// แนะนำให้วางไฟล์ JSON ไว้ใน src/config/ หรือ src/ เดียวกัน 
// แต่ถ้าจะไว้ใน public จริงๆ ให้ใช้การเรียกผ่าน URL ในโค้ดแทน 
// หรือถ้าต้องการ import เป็นก้อนข้อมูลเลย ให้วางไว้ในโฟลเดอร์ src ครับ

import assetData from './assets-config.json'; // สมมติว่าย้ายมาไว้ข้างๆ กันใน src/config

export interface AssetConfig {
  levels: {
    [key: string]: {
      image: string;
      video?: string;
    }
  };
  mascot: {
    idle: string;
    scared: string;
    happy: string;
  };
}

// ใช้ Type Assertion เพื่อให้ TS มั่นใจในโครงสร้างข้อมูล
export const ASSET_CONFIG = assetData as AssetConfig;