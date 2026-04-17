import React from 'react';
import Level1Link from './Level1Link';
import Level2Package from './Level2Package';
import Level3Call from './Level3Call';
import Level4Meetup from './Level4Meetup';
import Level5MusicScam from './Level5MusicScam';
import Level6TikTokScam from './Level6TikTokScam';
import GenericLevel from './GenericLevel'; // สำหรับด่าน 5-46
import { LEVELS } from '../data/levels';
import Level7OrderScam from './Level7OrderScam';
import Level8PackScam from './Level8PackScam';
import Level9MuleAccount from './Level9MuleAccount';

interface Props {
  levelIdx: number;
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
}

const LevelSwitcher: React.FC<Props> = (props) => {
  const currentLevel = LEVELS[props.levelIdx];

  // ถ้าเป็นด่านพิเศษ 1-5 (ใช้ SPECIAL)
  if (currentLevel.gameType === 'SPECIAL') {
    if (props.levelIdx === 0) return <Level1Link {...props} />;
    if (props.levelIdx === 1) return <Level2Package {...props} />;
    if (props.levelIdx === 2) return <Level3Call {...props} />;
    if (props.levelIdx === 3) return <Level4Meetup {...props} />;
    
    // สำหรับด่าน 5: ส่งเฉพาะสิ่งที่ Level5MusicScam ต้องการ
    if (props.levelIdx === 4) return (
      <Level5MusicScam 
        onWin={props.onWin} 
        onLose={props.onLose} 
        timeLeft={props.timeLeft} 
        onTutorialToggle={props.onTutorialToggle}
      />
    );
    if (props.levelIdx === 5) return (
      <Level6TikTokScam 
        onWin={props.onWin} 
        onLose={props.onLose} 
        timeLeft={props.timeLeft} 
        onTutorialToggle={props.onTutorialToggle}
      />
    );
    if (props.levelIdx === 6) return (
  <Level7OrderScam 
    onWin={props.onWin} 
    onLose={props.onLose} 
    timeLeft={props.timeLeft} 
    onTutorialToggle={props.onTutorialToggle}
  />
);
if (props.levelIdx === 7) return (
  <Level8PackScam 
    onWin={props.onWin} 
    onLose={props.onLose} 
    timeLeft={props.timeLeft} 
    onTutorialToggle={props.onTutorialToggle}
  />
);
if (props.levelIdx === 8) return (
  <Level9MuleAccount 
    onWin={props.onWin} 
    onLose={props.onLose} 
    timeLeft={props.timeLeft} 
    onTutorialToggle={props.onTutorialToggle}
  />
);
  }

  // ถ้าเป็นด่าน CHOICE (5-46)
return (
    <GenericLevel 
      key={props.levelIdx}
      levelData={currentLevel} // ต้องส่งข้อมูลคำถามของด่านปัจจุบันเข้าไปด้วย
      onWin={props.onWin} 
      onLose={props.onLose} 
      timeLeft={props.timeLeft} 
      onTutorialToggle={props.onTutorialToggle} 
    />
  );
};

export default LevelSwitcher;