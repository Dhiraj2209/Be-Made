export interface BaseOption {
  id: BaseId
  label: string
}

export type ConfigStep =
  | 'BASE'
  | 'BASE_COLOR'
  | 'TOP_COLOR'
  | 'TOP_SHAPE'
  | 'DIMENSION'
  | 'CHAIR'
  | 'SUMMARY'

export type BaseId =
  | 'LINEA'
  | 'LINEA_DOME'
  | 'LINEA_CONTOUR'
  | 'CURVA'
  | 'CRADLE'
  | 'TWISTE'
  | 'AXIS'
  | 'MOON'
  | 'THRIO'
  | 'BASE_8'
  | 'BUTTERFLY'

export interface BaseColorOption {
  id: string
  title: string
  preview: string
  maps: {
    map: string
    normalMap: string
    roughnessMap: string
    metalnessMap: string
  }
}

export type TopId =
  | 'CAPSULE'
  | 'OBLONG'
  | 'OVAL'
  | 'RECTANGLE'
  | 'ROUND'
  | 'SQUARE'

  export type ChairId = 'ARIA' | 'SIENA' | 'VELA'

export interface ChairColorMaps {
  map: string
  normalMap: string
  roughnessMap: string
  metalnessMap: string
}

export interface ChairColorOption {
  id: string
  title: string
  preview: string
  maps: {
    leg: ChairColorMaps
    top: ChairColorMaps
  }
}
