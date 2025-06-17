import React from 'react';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import {Fonts} from '../themes/Themes';

const CircularProgress = ({
  size,
  strokeWidth,
  progress,
  circleColor,
  progressColor,
  textColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressPercentage = progress / 100;
  const progressValue = circumference * (1 - progressPercentage);

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={circleColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={progressColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        strokeDashoffset={progressValue}
        strokeLinecap="butt"
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
      />
      <SvgText
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        stroke={textColor}
        fontSize="11"
        fontFamily={Fonts.VerdanaProMedium}
        dy=".3em"
        dx="0.0em">
        {`${progress}%`}
      </SvgText>
    </Svg>
  );
};

export default CircularProgress;
