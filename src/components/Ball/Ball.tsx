import React from "react";
import { Circle } from "react-konva";

interface BallProps {
  x: number;
  y: number;
  radius: number;
  fill: string;
}

const Ball: React.FC<BallProps> = ({ x, y, radius, fill }) => {
  return <Circle x={x} y={y} radius={radius} fill={fill} />;
};

export default Ball;
