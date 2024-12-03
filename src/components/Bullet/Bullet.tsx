import React from "react";
import { Rect } from "react-konva";

interface BulletProps {
  x: number;
  y: number;
}

const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  return <Rect x={x - 2.5} y={y} width={5} height={10} fill="black" />;
};

export default Bullet;
