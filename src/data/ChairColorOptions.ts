// src/data/chairColorOptions.ts

import type { ChairColorOption, ChairId } from '../types/configurator'

const createChairColors = (
  folder: string,
  colors: { id: string; title: string }[]
): ChairColorOption[] => {
  return colors.map((color) => ({
    id: color.id,
    title: color.title,
    preview: `/assets/images/accessories/${folder}/${color.id}/preview.webp`,
    maps: {
      leg: {
        map: `/assets/images/accessories/${folder}/${color.id}/chairLegColor.webp`,
        normalMap: `/assets/images/accessories/${folder}/${color.id}/chairLegNormal.webp`,
        roughnessMap: `/assets/images/accessories/${folder}/${color.id}/chairLegRoughness.webp`,
        metalnessMap: `/assets/images/accessories/${folder}/${color.id}/chairLegMetalness.webp`,
      },
      top: {
        map: `/assets/images/accessories/${folder}/${color.id}/chairTopColor.webp`,
        normalMap: `/assets/images/accessories/${folder}/${color.id}/chairTopNormal.webp`,
        roughnessMap: `/assets/images/accessories/${folder}/${color.id}/chairTopRoughness.webp`,
        metalnessMap: `/assets/images/accessories/${folder}/${color.id}/chairTopMetalness.webp`,
      },
    },
  }))
}

export const CHAIR_COLOR_OPTIONS: Partial<
  Record<ChairId, ChairColorOption[]>
> = {
  ARIA: createChairColors('aria', [
    { id: 'color1', title: 'Color 1' },
    { id: 'color2', title: 'Color 2' },
    { id: 'color3', title: 'Color 3' },
  ]),

  SIENA: createChairColors('siena', [
    { id: 'color1', title: 'Color 1' },
    { id: 'color2', title: 'Color 2' },
  ]),

  VELA: createChairColors('vela', [
    { id: 'color1', title: 'Color 1' },
    { id: 'color2', title: 'Color 2' },
  ]),
}
