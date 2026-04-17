import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
// นำเข้า Type หลักของโปรเจกต์ (ปรับ path ตามจริงของคุณ)
import { LevelConfig } from '../types';

interface Props {
  levelData: LevelConfig;
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const GenericLevel: React.FC<Props> = ({ levelData, onWin, onLose, timeLeft }) => {
  const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
    
// ดึง choices ออกมาจาก content
  const choices = levelData.content?.choices || [];

  const handleChoiceClick = (index: number) => {
    if (isAnswered) return;
    setSelectedChoice(index);
    setIsAnswered(true);

    if (choices[index].isCorrect) {
      setTimeout(() => onWin(), 1500);
    } else {
      setTimeout(() => onLose(), 1500);
    }
  };

  return (
    <div className="flex flex-col p-6 h-full bg-white">
      <h2 className="text-xl font-black mb-4">{levelData.title}</h2>
      <p className="mb-6 text-gray-600">{levelData.content?.question}</p>
      
      <div className="flex flex-col gap-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(index)}
            disabled={isAnswered}
            className={`p-4 rounded-xl border-2 font-bold text-left transition-all
              ${isAnswered && choice.isCorrect ? 'border-green-500 bg-green-50' : 
                isAnswered && selectedChoice === index && !choice.isCorrect ? 'border-red-500 bg-red-50' : 
                'border-gray-200'}
            `}
          >
            <div className="flex justify-between items-center">
              <span>{choice.text}</span>
              {isAnswered && choice.isCorrect && <CheckCircle2 className="text-green-500" />}
              {isAnswered && selectedChoice === index && !choice.isCorrect && <AlertTriangle className="text-red-500" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenericLevel;