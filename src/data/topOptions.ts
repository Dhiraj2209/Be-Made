import type { TopId } from '../types/configurator'

export const TOP_OPTIONS: {
  id: TopId
  label: string
  model: string
  modelMdf: string
  preview: string
  minLength: number
  maxLength: number
  minWidth: number
  maxWidth: number

  defaultLength: number
  defaultWidth: number
}[] = [
  {
    id: 'CAPSULE',
    label: 'Capsule',
    model: '/assets/images/top-shape/capsule/model.glb',
    modelMdf: '/assets/images/top-shape/capsule/model-mdf.glb',
    preview: '/assets/images/top-shape/capsule/preview.webp',
     minLength: 1600,
    maxLength: 3180,
    minWidth: 800,
    maxWidth: 1300,

    defaultLength: 3180,
    defaultWidth: 1300,
  },
  {
    id: 'RECTANGLE',
    label: 'Rectangle',
    model: '/assets/images/top-shape/rectangle/model.glb',
    modelMdf: '/assets/images/top-shape/rectangle/model-mdf.glb',
    preview: '/assets/images/top-shape/rectangle/preview.webp',
     minLength: 1600,
    maxLength: 3180,
    minWidth: 800,
    maxWidth: 1300,

    defaultLength: 3180 ,
    defaultWidth: 1300,
  },
  {
    id: 'OVAL',
    label: 'Oval',
    model: '/assets/images/top-shape/oval/model.glb',
    modelMdf: '/assets/images/top-shape/oval/model-mdf.glb',
    preview: '/assets/images/top-shape/oval/preview.webp',
     minLength: 1600,
    maxLength: 3180,
    minWidth: 800,
    maxWidth: 1300,

    defaultLength: 3180 ,
    defaultWidth: 1300,
  },
  {
    id: 'OBLONG',
    label: 'Oblong',
    model: '/assets/images/top-shape/oblong/model.glb',
    modelMdf: '/assets/images/top-shape/oblong/model-mdf.glb',
    preview: '/assets/images/top-shape/oblong/preview.webp',
      minLength: 1600,
    maxLength: 3180,
    minWidth: 800,
    maxWidth: 1300,

    defaultLength: 3180 ,
    defaultWidth: 1300,
  },
  {
    id: 'ROUND',
    label: 'Round Circle',
    model: '/assets/images/top-shape/round/model.glb',
    modelMdf: '/assets/images/top-shape/round/model-mdf.glb',
    preview: '/assets/images/top-shape/round/preview.webp',
     minLength: 1200,
    maxLength: 1580,
    minWidth: 1200,
    maxWidth: 1580,

    defaultLength: 1580,
    defaultWidth: 1580,
  },
  {
    id: 'SQUARE',
    label: 'Square',
    model: '/assets/images/top-shape/square/model.glb',
    modelMdf: '/assets/images/top-shape/square/model-mdf.glb',
    preview: '/assets/images/top-shape/square/preview.webp',
    minLength: 1200,
    maxLength: 1580,
    minWidth: 1200,
    maxWidth: 1580,

    defaultLength: 1580,
    defaultWidth: 1580,
  },
]
