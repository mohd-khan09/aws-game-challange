import React from "react";
import { Text } from "react-konva";

interface LivesProps {
  lives: number;
  canvasWidth: number;
}

const Lives: React.FC<LivesProps> = ({ lives, canvasWidth }) => {
  return (
    <Text
      text={`Lives: ${lives}`}
      x={canvasWidth - 100}
      y={10}
      fontSize={20}
      fill="black"
    />
  );
};

export default Lives;
