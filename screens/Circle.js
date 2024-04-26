import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';

const Circle = ({ progress, radius, strokeWidth, color, backgroundColor,txt }) => {
  const circumference = 2 * Math.PI * radius;
  const progressStrokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg height={radius * 2} width={radius * 2}>
        <SvgCircle
          cx={radius}
          cy={radius}
          
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={progressStrokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <Text>
          {txt}
        </Text>
      </View>
    </View>
  );
};

export default Circle;
