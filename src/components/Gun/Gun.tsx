import React from "react";
import { Rect } from "react-konva";

interface GunProps {
  x: number;
  y: number;
}

const Gun: React.FC<GunProps> = ({ x, y }) => {
  return <Rect x={x - 15} y={y - 5} width={30} height={20} fill="blue" />;
};

export default Gun;
