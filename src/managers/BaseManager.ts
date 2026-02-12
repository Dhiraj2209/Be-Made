import * as THREE from 'three';
import { configuratorStore } from '../store/configuratorStore';

export class BaseManager {
  static updateBaseGeometry(scene: THREE.Group) {
    const { baseId, topLength } = configuratorStore;

    // Normalized progress (0 to 1) based on length 1600mm to 3180mm
    const t = Math.max(0, Math.min(1, (topLength - 1600) / (3180 - 1600)));

    // Reset scene scale to default before applying transformations
    scene.scale.set(1, 1, 1);

    switch (baseId) {
      case 'LINEA':
        this.applyTwoPartSpacing(scene, t, 'left', 'right', 0.4, 0.85);
        break;

      case 'CURVA':
        // Based on your previous log: c_base and c_base001
        this.applyTwoPartSpacing(scene, t, 'c_base', 'c_base001', 0.4, 0.85);
        break;

      case 'TWISTE':
        // 🔥 Corrected names from your log: 'special_base' and 'special_bases'
        this.applyTwoPartSpacing(scene, t, 'special_base', 'special_bases', 0.45, 0.95);
        break;
      default:
        // No movement for single-pillar or dome bases
        break;
    }
  }

  private static applyTwoPartSpacing(
    scene: THREE.Group, 
    t: number, 
    partAName: string, 
    partBName: string, 
    minX: number, 
    maxX: number
  ) {
    const partA = scene.getObjectByName(partAName);
    const partB = scene.getObjectByName(partBName);

    if (partA && partB) {
      const currentX = minX + (maxX - minX) * t;
      
      // Logic: One part moves negative X, the other positive X
      // We check their current X to decide which is which, 
      // or just force them based on the math below:
      if (partA.position.x < 0) {
        partA.position.x = -currentX;
        partB.position.x = currentX;
      } else {
        partA.position.x = currentX;
        partB.position.x = -currentX;
      }
    } else {
      console.warn(`Mesh parts not found for ${configuratorStore.baseId}. 
      Check if ${partAName} and ${partBName} exist.`);
    }
  }
}