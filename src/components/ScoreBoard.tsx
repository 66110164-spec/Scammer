import React, { useEffect, useState } from 'react';
import { saveScore, getRankData } from '../firebase';
import { Trophy, RotateCcw } from 'lucide-react';

interface Props {
  name: string;
  age: number;
  score: number;
  onRestart: () => void;
}

const ScoreBoard: React.FC<Props> = ({ name, age, score, onRestart }) => {
  const [top5, setTop5] = useState<any[]>([]);
  const [rank, setRank] = useState<number | string>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      await saveScore(name, age, score); // บันทึกก่อน
      const data = await getRankData(score); // แล้วค่อยดึงอันดับ
      setTop5(data.top5);
      setRank(data.myRank);
      setLoading(false);
    };
    updateData();
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#15173D] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl">
        <h2 className="text-3xl font-black italic text-[#15173D] mb-2">FINISHED!</h2>
        
        {/* อันดับของคุณ */}
        <div className="bg-[#E491C9]/10 py-4 rounded-2xl mb-6 border-2 border-[#E491C9]/20">
          <p className="text-xs font-bold text-[#15173D]/50 uppercase tracking-widest">Your Rank</p>
          <div className="text-5xl font-black text-[#982598]">#{loading ? ".." : rank}</div>
          <p className="text-sm font-bold text-[#15173D]">Score: {score}</p>
        </div>

        {/* ตาราง Top 5 */}
        <div className="text-left mb-8">
          <div className="flex items-center gap-2 mb-3 text-[#15173D]">
            <Trophy size={16} />
            <span className="font-black text-xs uppercase">Top 5 Leaders</span>
          </div>
          <div className="space-y-2">
            {top5.map((user, i) => (
              <div key={i} className={`flex justify-between p-3 rounded-xl text-sm ${user.name === name ? 'bg-[#15173D] text-white' : 'bg-gray-100'}`}>
                <span className="font-bold">{i+1}. {user.name}</span>
                <span className="font-black">{user.score}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onRestart} className="w-full py-4 bg-[#15173D] text-white rounded-2xl font-bold flex items-center justify-center gap-2">
          <RotateCcw size={18} /> PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;