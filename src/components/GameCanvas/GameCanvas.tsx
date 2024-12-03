import React, { useState, useEffect, useCallback } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Bullet from "../Bullet/Bullet";
import Gun from "../Gun/Gun";
import { Circle, Rect as KonvaRect, Star } from "react-konva";

interface FallingShape {
  id: string;
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  shapeType: "circle" | "rect" | "star"; // Track the type of shape
  lives: number;
}

interface Bullet {
  x: number;
  y: number;
}

const GameCanvas: React.FC = () => {
  // Canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;

  const gunHeight = 30;
  const ballAreaHeight = canvasHeight - gunHeight;

  const toIsometric = (x: number, y: number) => {
    const isoX = (x - y) * Math.cos(Math.PI / 6); // 30 degrees
    const isoY = (x + y) * Math.sin(Math.PI / 6); // 30 degrees
    return { isoX, isoY };
  };
  // States
  const [shapes, setShapes] = useState<FallingShape[]>(
    Array.from({ length: 6 }, () => ({
      id: Math.random().toString(36).substring(2, 9),
      x: Math.random() * canvasWidth,
      y: (Math.random() * ballAreaHeight) / 2,
      radius: 20,
      dx: Math.random() > 0.5 ? 2 : -2,
      dy: Math.random() * 2 + 1,
      shapeType: ["circle", "rect", "star"][Math.floor(Math.random() * 3)] as
        | "circle"
        | "rect"
        | "star", // Ensure the correct type
      lives: Math.random() > 0.5 ? 1 : 2,
    }))
  );

  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [gunPosition, setGunPosition] = useState<{ x: number; y: number }>({
    x: canvasWidth / 2,
    y: canvasHeight - gunHeight / 2,
  });
  const [lives, setLives] = useState(50); // User starts with 5 lives
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Ball falling speed modifier (increases over time)
  const [speedModifier, setSpeedModifier] = useState(1);

  // Set start time after initial render
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  console.log(shapes);
  // Spawn a new shape every second for the first 5 seconds
  useEffect(() => {
    let shapeCount = 0;
    const spawnInterval = setInterval(() => {
      if (shapeCount >= 5) {
        clearInterval(spawnInterval);
        return;
      }
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: Math.random().toString(36).substring(2, 9),
          x: Math.random() * canvasWidth,
          y: 0,
          radius: 20,
          dx: 0,
          dy: 1 + speedModifier, // Starts slow and increases with speedModifier
          shapeType: ["circle", "rect", "star"][
            Math.floor(Math.random() * 3)
          ] as "circle" | "rect" | "star", // Ensure the correct type
          lives: Math.random() > 0.5 ? 1 : 2,
        },
      ]);

      shapeCount++;
    }, 1000);
    return () => clearInterval(spawnInterval);
  }, [speedModifier]);

  // Gradually increase speed over time
  useEffect(() => {
    const speedIncreaseInterval = setInterval(() => {
      setSpeedModifier((prev) => prev + 0.1); // Increase speed every second
    }, 1000);
    return () => clearInterval(speedIncreaseInterval);
  }, []);
  const spawnThreshold = canvasHeight * 0.7; // 70% of canvas height

  // Game loop for updating shape positions and detecting collisions
  // Game loop for updating shape positions and detecting collisions
  // Game loop for updating shape positions and detecting collisions
  useEffect(() => {
    if (gameOver || !timerRunning || lives <= 0) return;

    const interval = setInterval(() => {
      setShapes((prevShapes) => {
        const updatedShapes: FallingShape[] = [];
        prevShapes.forEach((shape) => {
          let { x, y, dy, radius } = shape;

          // Move shape
          y += dy * speedModifier;

          // If the shape falls below the canvas, remove it
          if (y + radius > canvasHeight) {
            // Decrease lives
            setLives((prevLives) => prevLives - 1);

            // Add a new shape only if lives are still > 0
            if (y > spawnThreshold) {
              addNewShape(); // Spawn a new shape
            }
            return; // Skip adding the current shape
          }

          updatedShapes.push({ ...shape, x, y });
        });

        return updatedShapes;
      });

      // Update bullets and remove off-screen ones
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 5 }))
          .filter((bullet) => bullet.y > 0)
      );

      // Detect collisions between bullets and shapes
      setShapes((prevShapes) => {
        return prevShapes.filter((shape) => {
          const isHit = bullets.some(
            (bullet) =>
              Math.sqrt(
                (bullet.x - shape.x) ** 2 + (bullet.y - shape.y) ** 2
              ) <= shape.radius
          );

          if (isHit) {
            // Decrease shape's lives
            setShapes((prevShapes) =>
              prevShapes.map((s) =>
                s.id === shape.id ? { ...s, lives: s.lives - 1 } : s
              )
            );
            // Remove the bullet after hit (bullet destruction)
            setBullets((prevBullets) =>
              prevBullets.filter(
                (bullet) =>
                  Math.sqrt(
                    (bullet.x - shape.x) ** 2 + (bullet.y - shape.y) ** 2
                  ) > shape.radius // Remove the bullet only if it doesn't hit the shape
              )
            );

            // If lives reach 0, remove the shape
            if (shape.lives - 1 <= 0) {
              setScore((prevScore) => prevScore + 1); // Increment score
              return false; // Remove shape
            }
          }

          return true; // Keep shape
        });
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [bullets, gameOver, timerRunning, speedModifier, lives]);

  // End game if lives reach zero or all shapes are cleared
  useEffect(() => {
    if (lives <= 0 || (shapes.length === 0 && !gameOver)) {
      const endTime = Date.now();
      setTimeTaken(((endTime - (startTime || 0)) / 1000).toFixed(2));
      setGameOver(true);
      setTimerRunning(false);
    }
  }, [shapes, lives, gameOver, startTime]);

  // Add new shapes when lives are still > 0
  const addNewShape = () => {
    if (gameOver || lives <= 0) return; // Prevent new shapes from being added
    setShapes((prevShapes) => [
      ...prevShapes,
      {
        id: Math.random().toString(36).substring(2, 9),
        x: Math.random() * canvasWidth,
        y: 0, // Start at the top
        radius: 20,
        dx: 0,
        dy: Math.random() * 2 + 1, // Random speed
        shapeType: ["circle", "rect", "star"][Math.floor(Math.random() * 3)] as
          | "circle"
          | "rect"
          | "star", // Ensure correct type
        lives: Math.random() > 0.5 ? 1 : 2,
      },
    ]);
  };

  // Handle shooting
  const handleShoot = useCallback(() => {
    if (gameOver) return;
    setBullets((prevBullets) => [
      ...prevBullets,
      { x: gunPosition.x, y: gunPosition.y - 20 },
    ]);
  }, [gameOver, gunPosition]);

  // Move gun with mouse
  const handleMouseMove = useCallback(
    (e: any) => {
      const mouseX = e.evt.layerX;
      setGunPosition({ x: mouseX, y: canvasHeight - gunHeight / 2 });
    },
    [canvasHeight, gunHeight]
  );

  // Shape rendering
  // Shape rendering
  const renderShape = (shape: FallingShape) => {
    const { x, y, radius, shapeType, lives } = shape;
    const { isoX, isoY } = toIsometric(x, y);

    // Determine color based on lives
    let fillColor = "red";
    if (lives === 1) {
      fillColor = "white"; // Half white for 1 life left
    } else if (lives === 2) {
      fillColor = "red"; // Full color for 2 lives
    }

    // Add half white effect if the shape has been hit once
    const shapeStyle =
      lives === 1
        ? { fill: "white", stroke: "red", strokeWidth: 2 }
        : { fill: fillColor };

    switch (shapeType) {
      case "circle":
        return (
          <Circle key={shape.id} x={x} y={y} radius={radius} {...shapeStyle} />
        );
      case "rect":
        return (
          <KonvaRect
            key={shape.id}
            x={x}
            y={y}
            width={radius * 2}
            height={radius}
            {...shapeStyle}
          />
        );
      case "star":
        return (
          <Star
            key={shape.id}
            x={x}
            y={y}
            innerRadius={radius / 2}
            outerRadius={radius}
            numPoints={5}
            {...shapeStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
        onClick={handleShoot}
        style={{ border: "1px solid black", margin: "auto", display: "block" }}
      >
        {/* Background */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="white"
          />
        </Layer>

        {/* Falling Shapes and Bullets */}
        <Layer>
          {shapes.map((shape) => renderShape(shape))}
          {bullets.map((bullet, index) => (
            <Bullet key={index} x={bullet.x} y={bullet.y} />
          ))}
        </Layer>

        {/* Gun */}
        <Layer>
          <Gun x={gunPosition.x} y={gunPosition.y} />
          <Rect
            x={0}
            y={ballAreaHeight}
            width={canvasWidth}
            height={gunHeight}
            fill="lightgray"
          />
        </Layer>
      </Stage>

      {/* Score Display */}
      {!gameOver && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "20px",
            color: "white",
          }}
        >
          <span>Score: {score}</span>
          <span style={{ marginLeft: "20px" }}>Lives: {lives}</span>
          <span style={{ marginLeft: "20px" }}>
            Time: {((Date.now() - (startTime || Date.now())) / 1000).toFixed(1)}
            s
          </span>
        </div>
      )}

      {/* Game Over Message */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "30px",
            fontWeight: "bold",
            color: "red",
            textAlign: "center",
          }}
        >
          <p>Game Over</p>
          {timeTaken && <p>Time Taken: {timeTaken} seconds</p>}
          <p>Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
