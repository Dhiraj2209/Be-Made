import type { BaseColorOption, BaseId } from '../types/configurator'

const createColors = (
  folder: string,
  colors: { id: string; title: string }[]
): BaseColorOption[] => {
  return colors.map((color) => ({
    id: color.id,
    title: color.title,
    preview: `/assets/images/base-shape/${folder}/${color.id}/preview.webp`,
    maps: {
      map: `/assets/images/base-shape/${folder}/${color.id}/base_color.webp`,
      normalMap: `/assets/images/base-shape/${folder}/${color.id}/normal.webp`,
      roughnessMap: `/assets/images/base-shape/${folder}/${color.id}/roughness.webp`,
      metalnessMap: `/assets/images/base-shape/${folder}/${color.id}/metalness.webp`,
    },
  }))
}

export const BASE_COLOR_OPTIONS: Partial<
  Record<BaseId, BaseColorOption[]>
> = {
  LINEA: createColors('linea', [
    { id: 'color1', title: 'Gold' },
    { id: 'color2', title: 'Book Black' },
  ]),
  LINEA_DOME: createColors('linea-dome', [
    { id: 'color1', title: 'Gold' },
    { id: 'color2', title: 'Cocoa Iron' },
  ]),
  LINEA_CONTOUR: createColors('linea-contour', [
    { id: 'color1', title: 'Gold' },
    { id: 'color2', title: 'Cocoa Iron' },
  ]),
  CURVA: createColors('curva', [
    { id: 'color1', title: 'Champagne' },
  ]),
  CRADLE: createColors('cradle', [
    { id: 'color1', title: 'Champagne' },
    { id: 'color2', title: 'Graphite' },
  ]),
  TWISTE: createColors('twiste', [
    { id: 'color1', title: 'Brass Teak' },
  ]),
  AXIS: createColors('axis', [
    { id: 'color1', title: 'Graphite' },
    { id: 'color2', title: 'Cashmere Metal' },
  ]),
  MOON: createColors('moon', [
    { id: 'color1', title: 'Cloth Grey' },
    { id: 'color2', title: 'Cloth Gold' },
  ]),
  THRIO: createColors('thrio', [
    { id: 'color1', title: 'Graphite' },
    { id: 'color2', title: 'Cashmere Metal' },
  ]),
  BASE_8: createColors('base-8', [
    { id: 'color1', title: 'Graphite' },
    { id: 'color2', title: 'Cashmere Metal' },
  ]),
  BUTTERFLY: createColors('butterfly', [
    { id: 'color1', title: 'Graphite' },
    { id: 'color2', title: 'Cashmere Metal' },
  ]), 
}
