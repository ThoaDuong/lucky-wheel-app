import { WheelColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Polygon, Text as SvgText, Defs, Filter, FeDropShadow } from 'react-native-svg';
import { useAudio } from '@/hooks/AudioProvider';

interface SpinningWheelProps {
  names: string[];
  onSpinEnd: (winner: string) => void;
  spinning: boolean;
  onSpinComplete: () => void;
}

const WHEEL_SIZE = Dimensions.get('window').width * 0.85;
const CENTER_X = WHEEL_SIZE / 2;
const CENTER_Y = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 8;
const CENTER_RADIUS = WHEEL_SIZE * 0.08;

const AnimatedView = Animated.createAnimatedComponent(View);

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ');
}

export default function SpinningWheel({ names, spinning, onSpinEnd, onSpinComplete }: SpinningWheelProps) {
  const { playTick } = useAudio();
  const rotation = useSharedValue(0);
  const lastTickIndex = useSharedValue(0);
  const segmentAngle = 360 / (names.length || 1);

  useAnimatedReaction(
    () => rotation.value,
    (currentRotation) => {
      const index = Math.floor(currentRotation / segmentAngle);
      if (index !== lastTickIndex.value) {
        lastTickIndex.value = index;
        runOnJS(playTick)();
      }
    }
  );

  useEffect(() => {
    if (spinning && names.length > 0) {
      // Random extra rotations (5-8 full spins) + random landing position
      const extraSpins = 5 + Math.random() * 3;
      const randomAngle = Math.random() * 360;
      const targetRotation = rotation.value + extraSpins * 360 + randomAngle;

      rotation.value = withTiming(targetRotation, {
        duration: 4000 + Math.random() * 1000,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      }, (finished) => {
        if (finished) {
          // Calculate which segment the pointer is on
          // The pointer is at the rightmost point (0° / 360°)
          const normalizedAngle = ((targetRotation % 360) + 360) % 360;
          // Pointer is at right (0°), segments start from top going clockwise
          // The pointer at 0° corresponds to 90° on the standard circle
          const pointerAngle = (360 - normalizedAngle + 90) % 360;
          const winnerIndex = Math.floor(pointerAngle / segmentAngle) % names.length;
          runOnJS(onSpinEnd)(names[winnerIndex]);
          runOnJS(onSpinComplete)();
        }
      });
    }
  }, [spinning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (names.length === 0) {
    return (
      <View style={styles.container}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RADIUS}
            fill="#E9ECEF"
            stroke="#DEE2E6"
            strokeWidth={3}
          />
          <SvgText
            x={CENTER_X}
            y={CENTER_Y}
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={16}
            fill="#ADB5BD"
            fontWeight="600"
          >
            Thêm tên để bắt đầu
          </SvgText>
        </Svg>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointerContainer}>
        <Svg width={50} height={50}>
          <Defs>
            <Filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <FeDropShadow dx="-2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
            </Filter>
          </Defs>
          <G filter="url(#drop-shadow)">
            <Polygon
              points="40,5 35,25 40,45 5,25"
              fill="#E12530"
              stroke="#b3121b"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </G>
        </Svg>
      </View>

      <AnimatedView style={[styles.wheelWrapper, animatedStyle]}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {/* Shadow / outer ring */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RADIUS + 4}
            fill="none"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={8}
          />

          {/* Segments */}
          {names.map((name, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const color = WheelColors[index % WheelColors.length];
            const path = describeArc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle);

            // Text position — along the middle of the arc
            const midAngle = startAngle + segmentAngle / 2;
            const textRadius = RADIUS * 0.62;
            const textPos = polarToCartesian(CENTER_X, CENTER_Y, textRadius, midAngle);
            const textRotation = midAngle;

            // Determine text color based on background brightness
            const truncatedName = name.length > 10 ? name.substring(0, 9) + '…' : name;
            const fontSize = names.length > 8 ? 11 : names.length > 5 ? 13 : 15;

            return (
              <G key={`segment-${index}`}>
                <Path
                  d={path}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
                <SvgText
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fontSize={fontSize}
                  fontWeight="bold"
                  fill="#FFFFFF"
                  transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                >
                  {truncatedName}
                </SvgText>
              </G>
            );
          })}

          {/* Center circle */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={CENTER_RADIUS}
            fill="#FFFFFF"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={3}
          />
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={CENTER_RADIUS - 6}
            fill="#F8F9FA"
          />
        </Svg>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointerContainer: {
    position: 'absolute',
    right: -15,
    zIndex: 10,
  },
});
