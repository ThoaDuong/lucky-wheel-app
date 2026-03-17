import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { DRINKING_QUESTIONS, DRINKING_CHALLENGES } from '@/constants/drinking-game';
import { useAudio } from '@/hooks/AudioProvider';

export function useDrinkingGame() {
  const [phase, setPhase] = useState<'select_mode' | 'reveal'>('select_mode');
  const [mode, setMode] = useState<'nhẹ nhàng' | 'sát phạt' | null>(null);

  const [currentText, setCurrentText] = useState('');
  const { playClick } = useAudio();

  const [truthCount, setTruthCount] = useState(0);
  const [dareCount, setDareCount] = useState(0);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleSelectMode = (selectedMode: 'nhẹ nhàng' | 'sát phạt') => {
    playClick();
    setMode(selectedMode);
    setTruthCount(0);
    setDareCount(0);
    drawCard(selectedMode, true);
  };

  const drawCard = (currentMode: 'nhẹ nhàng' | 'sát phạt', isFirst: boolean = false) => {
    let newTruthCount = truthCount;
    let newDareCount = dareCount;

    if (isFirst) {
      newTruthCount = 0;
      newDareCount = 0;
    }

    if (currentMode === 'nhẹ nhàng') {
      if (newTruthCount >= DRINKING_QUESTIONS.length) {
        setCurrentText("Bạn đã rút hết thẻ Nhẹ Nhàng rồi!");
      } else {
        setCurrentText(DRINKING_QUESTIONS[newTruthCount]);
        setTruthCount(newTruthCount + 1);
      }
    } else {
      if (newDareCount >= DRINKING_CHALLENGES.length) {
        setCurrentText("Bạn đã rút hết thẻ Sát Phạt rồi!");
      } else {
        setCurrentText(DRINKING_CHALLENGES[newDareCount]);
        setDareCount(newDareCount + 1);
      }
    }

    setPhase('reveal');
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: isFirst ? 0 : 600,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    playClick();
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (mode) {
        drawCard(mode);
      }
    });
  };

  const handleRestart = () => {
    playClick();
    setPhase('select_mode');
    setMode(null);
    setCurrentText('');
    flipAnim.setValue(0);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return {
    phase,
    mode,
    currentText,
    truthCount,
    dareCount,
    handleSelectMode,
    handleNext,
    handleRestart,
    frontAnimatedStyle,
    backAnimatedStyle
  };
}
