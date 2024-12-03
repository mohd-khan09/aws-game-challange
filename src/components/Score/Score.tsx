import React from "react";
import { Text } from "react-konva";

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <Text text={`Score: ${score}`} x={10} y={10} fontSize={20} fill="black" />
  );
};

export default Score;
