// src/data/chairOptions.ts
import type { ChairId } from '../types/configurator'

export const CHAIR_OPTIONS: {
  id: ChairId
  title: string
  image: string
  model: string
}[] = [
  {
    id: 'ARIA',
    title: 'Aria',
    image: '/assets/images/accessories/aria/preview.webp',
    model: '/assets/images/accessories/aria/model.glb',
  },
  {
    id: 'SIENA',
    title: 'Siena',
    image: '/assets/images/accessories/siena/preview.webp',
    model: '/assets/images/accessories/siena/model.glb',
  },
  {
    id: 'VELA',
    title: 'Vela',
    image: '/assets/images/accessories/vela/preview.webp',
    model: '/assets/images/accessories/vela/model.glb',
  },
]
