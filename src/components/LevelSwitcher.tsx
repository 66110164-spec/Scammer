import React from 'react';
import { LEVELS } from '../data/levels';
import Level1Link from './Level1Link';
import Level2Package from './Level2Package';
import Level3Call from './Level3Call';
import Level4Meetup from './Level4Meetup';
import Level5MusicScam from './Level5MusicScam';
import Level6TikTokScam from './Level6TikTokScam';
import Level7OrderScam from './Level7OrderScam';
import Level8PackScam from './Level8PackScam';
import Level9MuleAccount from './Level9MuleAccount';
import Level10SimScam from './Level10SimScam';
import Level11FaceScanScam from './Level11FaceScanScam';
import Level12CallCenterHell from './Level12CallCenterHell';
import Level13CryptoScam from './Level13CryptoScam';
import Level14RomanceScam from './Level14RomanceScam';
import Level15FakePolice from './Level15FakePolice';
import Level16QuickSensor from './Level16QuickSensor';
import Level17LiveLocation from './Level17LiveLocation';
import Level18PrivacyCurtain from './Level18PrivacyCurtain';
import Level19PhoneSlice from './Level19PhoneSlice';
import Level20QRBlackout from './Level20QRBlackout';

interface Props {
  levelIdx: number;
  onWin: () => void;
  onLose: () => void;
  timeLeft: number;
  onTutorialToggle: (isShowing: boolean) => void;
  onRetry: () => void; // เพิ่ม props นี้
}

const LevelSwitcher: React.FC<Props> = (props) => {
  const currentLevel = LEVELS[props.levelIdx];

  // ส่ง props ทั้งหมดรวมถึง onRetry ไปที่ด่านต่างๆ
  const commonProps = {
    onWin: props.onWin,
    onLose: props.onLose,
    timeLeft: props.timeLeft,
    onTutorialToggle: props.onTutorialToggle,
    onRetry: props.onRetry
  };

  if (currentLevel.gameType === 'SPECIAL') {
    if (props.levelIdx === 0) return <Level1Link {...commonProps} />;
    if (props.levelIdx === 1) return <Level2Package {...commonProps} />;
    if (props.levelIdx === 2) return <Level3Call {...commonProps} />;
    if (props.levelIdx === 3) return <Level4Meetup {...commonProps} />;
    if (props.levelIdx === 4) return <Level5MusicScam {...commonProps} />;
    if (props.levelIdx === 5) return <Level6TikTokScam {...commonProps} />;
    if (props.levelIdx === 6) return <Level7OrderScam {...commonProps} />;
    if (props.levelIdx === 7) return <Level8PackScam {...commonProps} />;
    if (props.levelIdx === 8) return <Level9MuleAccount {...commonProps} />;
    if (props.levelIdx === 9) return <Level10SimScam {...commonProps} />;
    if (props.levelIdx === 10) return <Level11FaceScanScam {...commonProps} />;
    if (props.levelIdx === 11) return <Level12CallCenterHell {...commonProps} />;
    if (props.levelIdx === 12) return <Level13CryptoScam {...commonProps} />;
    if (props.levelIdx === 13) return <Level14RomanceScam {...commonProps} />;
    if (props.levelIdx === 14) return <Level15FakePolice {...commonProps} />;
    if (props.levelIdx === 15) return <Level16QuickSensor {...commonProps} />;
    if (props.levelIdx === 16) return <Level17LiveLocation {...commonProps} />;
    if (props.levelIdx === 17) return <Level18PrivacyCurtain {...commonProps} />;
    if (props.levelIdx === 18) return <Level19PhoneSlice {...commonProps} />;
    if (props.levelIdx === 19) return <Level20QRBlackout {...commonProps} />;
  }
  return null;
};

export default LevelSwitcher;