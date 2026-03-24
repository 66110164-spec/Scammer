import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, collection, doc, setDoc, 
  query, orderBy, limit, getDocs, serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxhzs8Yu0s95tSiJZEn-byOS7BRTSoGtE",
  authDomain: "scammer101.firebaseapp.com",
  projectId: "scammer101",
  storageBucket: "scammer101.firebasestorage.app",
  messagingSenderId: "808413027496",
  appId: "1:808413027496:web:058425c86a33995a95369d",
  measurementId: "G-12NDKHY7Q8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const getOrCreateDeviceId = () => {
  let id = localStorage.getItem('scammer101_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('scammer101_device_id', id);
  }
  return id;
};


export const saveScore = async (name: string, age: number, score: number) => {
  if (!name || name === "Player") return; 
  
  // ใช้ชื่อพิมพ์เล็กทั้งหมดให้ตรงกับที่ตั้งใน Console
  const docId = `${name.trim().toLowerCase()}_${age}`; 
  const userRef = doc(db, "leaderboard", docId);
  
  try {
    await setDoc(userRef, {
      name: name.trim(),
      age: Math.floor(Number(age)),   // Math.floor ช่วยปัดเศษให้เป็น Integer (int64) ชัวร์ๆ
      score: Math.floor(Number(score)), // ปัดเศษให้เป็นเลขจำนวนเต็ม
      timestamp: serverTimestamp()     // ใช้เวลาจาก Server จะแม่นยำกว่า New Date() ของเครื่อง
    }, { merge: true });
    console.log("บันทึกคะแนนสำเร็จ!");
  } catch (e) {
    console.error("บันทึกผิดพลาด: ", e);
  }
};

export const getRankData = async (currentScore: number) => {
  try {
    const colRef = collection(db, "leaderboard");

    // ดึง Top 5
    const qTop = query(colRef, orderBy("score", "desc"), limit(5));
    const snapTop = await getDocs(qTop);
    const top5 = snapTop.docs.map(d => d.data());

    // ดึงคะแนนทั้งหมดมาหาอันดับ
    const qRank = query(colRef, orderBy("score", "desc"));
    const snapAll = await getDocs(qRank);
    const allScores = snapAll.docs.map(d => d.data().score);
    
    // สำคัญ: ต้องมั่นใจว่า currentScore ที่ส่งมาเป็น Number
    const myRank = allScores.indexOf(Math.floor(currentScore)) + 1;

    return { 
      top5, 
      myRank: myRank > 0 ? myRank : "N/A" 
    };
  } catch (e) {
    console.error("ดึงข้อมูลอันดับล้มเหลว: ", e);
    return { top5: [], myRank: "N/A" };
  }
};

export { db };