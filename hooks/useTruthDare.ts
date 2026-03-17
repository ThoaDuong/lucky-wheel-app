import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { TRUTH_QUESTIONS, DARE_CHALLENGES } from '@/constants/truth-dare';
import { useAudio } from '@/hooks/AudioProvider';

export function useTruthDare() {
  const [phase, setPhase] = useState<'select_mode' | 'choose' | 'reveal'>('select_mode');
  const [mode, setMode] = useState<'sequence' | 'random' | null>(null);

  const [currentText, setCurrentText] = useState('');
  const [type, setType] = useState<'truth' | 'dare' | null>(null);
  const { playClick } = useAudio();

  const [truthCount, setTruthCount] = useState(0);
  const [dareCount, setDareCount] = useState(0);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleSelectMode = (selectedMode: 'sequence' | 'random') => {
    playClick();
    setMode(selectedMode);
    if (selectedMode === 'sequence') {
      setTruthCount(0);
      setDareCount(0);
    }
    setPhase('choose');
  };

  const handleChoose = (choice: 'truth' | 'dare') => {
    playClick();
    setType(choice);

    if (mode === 'sequence') {
      if (choice === 'truth') {
        if (truthCount >= TRUTH_QUESTIONS.length) {
          setCurrentText("Bạn đã rút hết thẻ Thật rồi!");
        } else {
          setCurrentText(TRUTH_QUESTIONS[truthCount]);
          setTruthCount(prev => prev + 1);
        }
      } else {
        if (dareCount >= DARE_CHALLENGES.length) {
          setCurrentText("Bạn đã rút hết thẻ Thách rồi!");
        } else {
          setCurrentText(DARE_CHALLENGES[dareCount]);
          setDareCount(prev => prev + 1);
        }
      }
    } else {
      const list = choice === 'truth' ? TRUTH_QUESTIONS : DARE_CHALLENGES;
      const randomText = list[Math.floor(Math.random() * list.length)];
      setCurrentText(randomText);
    }

    setPhase('reveal');
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
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
      setPhase('choose');
      setType(null);
      setCurrentText('');
    });
  };

  const handleRestart = () => {
    playClick();
    setPhase('select_mode');
    setMode(null);
    setType(null);
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
    type,
    truthCount,
    dareCount,
    handleSelectMode,
    handleChoose,
    handleNext,
    handleRestart,
    frontAnimatedStyle,
    backAnimatedStyle
  };
}
