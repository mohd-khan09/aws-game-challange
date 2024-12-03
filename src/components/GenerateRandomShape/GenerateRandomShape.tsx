import { Circle, Rect, Ellipse, Star, RegularPolygon } from "react-konva";

export const generateRandomShape = (x: number, y: number) => {
  const shapes = ["Circle", "Rect", "Ellipse", "Star", "RegularPolygon"];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color

  switch (randomShape) {
    case "Circle":
      return (
        <Circle x={x} y={y} radius={20 + Math.random() * 20} fill={color} />
      );
    case "Rect":
      return (
        <Rect
          x={x}
          y={y}
          width={30 + Math.random() * 40}
          height={30 + Math.random() * 40}
          fill={color}
        />
      );
    case "Ellipse":
      return (
        <Ellipse
          x={x}
          y={y}
          radiusX={20 + Math.random() * 20}
          radiusY={10 + Math.random() * 10}
          fill={color}
        />
      );
    case "Star":
      return (
        <Star
          x={x}
          y={y}
          numPoints={5}
          innerRadius={10 + Math.random() * 10}
          outerRadius={20 + Math.random() * 20}
          fill={color}
        />
      );
    case "RegularPolygon":
      return (
        <RegularPolygon
          x={x}
          y={y}
          sides={3 + Math.floor(Math.random() * 5)} // Triangle to hexagon
          radius={20 + Math.random() * 20}
          fill={color}
        />
      );
    default:
      return null;
  }
};
