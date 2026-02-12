// src/managers/ChairPlacementManager.ts
import { getMaxChairs } from '../data/seatingCapacity';
import type { TopId } from '../types/configurator';

export interface Placement {
  position: [number, number, number];
  rotation: [number, number, number];
}

/**
 * ROUND SHAPE LOGIC
 * Distributes chairs in a perfect circle
 */
const getRoundPlacements = (diameter: number, qty: number): Placement[] => {
  const placements: Placement[] = [];
  const radius = (diameter / 1000 / 2) + 0.25; // Scene units + offset

  
  for (let i = 0; i < qty; i++) {
    const angle = (i / qty) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    placements.push({
      position: [x, 0, z],
      // Face center: -angle - Math.PI / 2
      rotation: [0, -angle - Math.PI / 2, 0],
    });
  }
  return placements;
};

const getSquarePlacements = (size: number, qty: number): Placement[] => {
  const placements: Placement[] = [];
  const s = size / 1000; 
  const offset = (s / 2) + 0.25; 
  const chairSpacing = 0.65; // Increased spacing for better UI

  // Define distribution per side: [North, South, East, West]
  const sideConfig: Record<number, number[]> = {
    2: [1, 1, 0, 0], // One on North, one on South
    4: [1, 1, 1, 1], // One on each side
    6: [2, 2, 1, 1], // Two on N/S, one on E/W
    8: [2, 2, 2, 2], // Two on all sides
  };

  const distribution = sideConfig[qty] || [0, 0, 0, 0];

  distribution.forEach((count, side) => {
    for (let i = 0; i < count; i++) {
      let x = 0, z = 0, rot = 0;
      
      // Center the chairs if there is only 1, or offset them if there are 2
      const shift = count === 2 ? (i === 0 ? -chairSpacing / 2 : chairSpacing / 2) : 0;

      switch(side) {
        case 0: // North
          x = shift; z = -offset; rot = 0; break;
        case 1: // South
          x = shift; z = offset; rot = Math.PI; break;
        case 2: // East
          x = offset; z = shift; rot = -Math.PI / 2; break;
        case 3: // West
          x = -offset; z = shift; rot = Math.PI / 2; break;
      }

      placements.push({ position: [x, 0, z], rotation: [0, rot, 0] });
    }
  });

  return placements;
};


const getRectanglePlacements = (
  length: number,
  width: number,
  qty: number
): Placement[] => {
  const placements: Placement[] = [];

  // 1. Tweak this value to adjust the spacing! 
  // 1.0 = Full table length, 0.7 = Chairs tighter together
  const gapFactor = 1.2; 

  // Enforce Max Capacity based on SEATING_CAPACITY
  const { max } = getMaxChairs(length);
  const actualQty = Math.min(qty, max);

  const l = length / 1000; // mm to meters
  const w = width / 1000;

  // Distance from table center to chair position
  const longOffset = (l / 2) + 0.25; 
  const shortOffset = (w / 2) + 0.25;

  let sideEndsCount = actualQty >= 4 ? 2 : 0;
  let longSideTotal = actualQty - sideEndsCount;

  // ---------------------------------------------------
  // 1. LEFT & RIGHT SIDES (Short ends)
  // ---------------------------------------------------
  if (sideEndsCount >= 1) {
    placements.push({
      position: [-longOffset, 0, 0],
      rotation: [0, Math.PI / 2, 0],
    });
    placements.push({
      position: [longOffset, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
    });
  } else if (actualQty === 2) {
      longSideTotal = 2;
  }

  // ---------------------------------------------------
  // 2. TOP & BOTTOM SIDES (With Gap Variable)
  // ---------------------------------------------------
  const countPerLongSide = Math.floor(longSideTotal / 2);

  const distributeLongSide = (count: number, zOffset: number, rotationY: number) => {
    if (count <= 0) return;

    if (count === 1) {
      placements.push({
        position: [0, 0, zOffset],
        rotation: [0, rotationY, 0],
      });
    } else {
      /**
       * We multiply the length by gapFactor to define the "seating area"
       * count + 1 creates equal segments (e.g., 2 chairs = 3 parts)
       */
      const activeLength = l * gapFactor;
      const segments = count + 1;
      const segmentSize = activeLength / segments;

      for (let i = 1; i <= count; i++) {
        const xFromStart = i * segmentSize;
        // Center the chairs relative to the table's 0,0,0
        const x = xFromStart - (activeLength / 2);

        placements.push({
          position: [x, 0, zOffset],
          rotation: [0, rotationY, 0],
        });
      }
    }
  };

  distributeLongSide(countPerLongSide, -shortOffset, 0);
  distributeLongSide(countPerLongSide, shortOffset, Math.PI);

  return placements;
};

const getOblongPlacements = (
  length: number,
  width: number,
  qty: number
): Placement[] => {
  const placements: Placement[] = [];

  // --- Tweakable Variables ---
  const gapFactor = 1.25; // How spread out the top/bottom chairs are
  const curveIntensity = 0.15; // How much top/bottom chairs tilt near the ends
  const offset = 0.25; // Distance from table edge
  // ---------------------------

  // Enforce Max Capacity based on SEATING_CAPACITY
  const { max } = getMaxChairs(length);
  const actualQty = Math.min(qty, max);

  const l = length / 1000;
  const w = width / 1000;

  const halfStraight = (l - w) / 2;
  const radius = w / 2;
  const zOffset = radius + offset;

  let sideEndsCount = actualQty >= 4 ? 2 : 0;
  let longSideTotal = actualQty - sideEndsCount;

  // ---------------------------------------------------
  // 1. LEFT & RIGHT CURVES (The Ends)
  // ---------------------------------------------------
  if (sideEndsCount >= 1) {
    // Left Curve Center
    placements.push({
      position: [-(halfStraight + radius + offset), 0, 0],
      rotation: [0, Math.PI / 2, 0],
    });
    // Right Curve Center
    placements.push({
      position: [(halfStraight + radius + offset), 0, 0],
      rotation: [0, -Math.PI / 2, 0],
    });
  } else if (actualQty === 2) {
    longSideTotal = 2;
  }

  // ---------------------------------------------------
  // 2. TOP & BOTTOM (With Curvature & Grid Spacing)
  // ---------------------------------------------------
  const countPerLongSide = Math.floor(longSideTotal / 2);

  const distributeOblongSide = (count: number, sideZ: number, baseRotation: number) => {
    if (count <= 0) return;

    if (count === 1) {
      placements.push({
        position: [0, 0, sideZ],
        rotation: [0, baseRotation, 0],
      });
    } else {
      const activeLength = l * gapFactor;
      const segments = count + 1;
      const segmentSize = activeLength / segments;

      for (let i = 1; i <= count; i++) {
        const xFromStart = i * segmentSize;
        const x = xFromStart - (activeLength / 2);

        // Calculate a slight rotation based on how far 'x' is from the center
        // This makes the chairs "follow" the oblong curve slightly
        const tilt = (x / (l / 2)) * curveIntensity;
        const finalRotation = baseRotation - tilt;

        placements.push({
          position: [x, 0, sideZ],
          rotation: [0, finalRotation, 0],
        });
      }
    }
  };

  // Top (facing down)
  distributeOblongSide(countPerLongSide, -zOffset, 0);
  
  // Bottom (facing up)
  distributeOblongSide(countPerLongSide, zOffset, Math.PI);

  return placements;
};
const getOvalPlacements = (
  length: number,
  width: number,
  qty: number
): Placement[] => {

  const placements: Placement[] = [];

  const a = (length / 1000) / 2;
  const b = (width / 1000) / 2;

  const offset = 0.25;

  const perSide = Math.floor(qty / 2); // split equally

  // 🔼 TOP SIDE (0 → π)
  for (let i = 0; i < perSide; i++) {

    const t = (i + 1) / (perSide + 1); // avoids extreme ends
    const angle = Math.PI * t;

    const x = Math.cos(angle) * (a + offset);
    const z = Math.sin(angle) * (b + offset);

    placements.push({
      position: [x, 0, z],
      rotation: [0, -angle - Math.PI / 2, 0],
    });
  }

  // 🔽 BOTTOM SIDE (π → 2π)
  for (let i = 0; i < perSide; i++) {

    const t = (i + 1) / (perSide + 1);
    const angle = Math.PI + Math.PI * t;

    const x = Math.cos(angle) * (a + offset);
    const z = Math.sin(angle) * (b + offset);

    placements.push({
      position: [x, 0, z],
      rotation: [0, -angle - Math.PI / 2, 0],
    });
  }

  return placements;
};



/**
 * MAIN ENTRY POINT
 */
export const calculateChairPlacements = (
  shape: TopId,
  length: number,
  width: number,
  quantity: number
): Placement[] => {
    const safeQty = Math.max(2, quantity % 2 === 0 ? quantity : quantity - 1);
  switch (shape) {
    case 'ROUND':
      return getRoundPlacements(length, safeQty);
    case 'SQUARE':
      return getSquarePlacements(length, safeQty);
      case 'RECTANGLE':
    case  'CAPSULE':
      return getRectanglePlacements(length, width, safeQty);
      case 'OBLONG':
  return getOblongPlacements(length, width, safeQty);
    case 'OVAL':
  return getOvalPlacements(length, width, quantity);
    default:
      return [];
  }
};