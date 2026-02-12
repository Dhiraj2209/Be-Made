import { BASE_COLOR_OPTIONS } from '../data/baseColors'
import { BASE_OPTIONS } from '../data/baseOptions'
import { CHAIR_COLOR_OPTIONS } from '../data/ChairColorOptions'
import { CHAIR_OPTIONS } from '../data/chairOptions'
import { TOP_COLORS } from '../data/topColors'
import { TOP_OPTIONS } from '../data/topOptions'
import type { BaseId, ChairId, TopId } from '../types/configurator'

export const getTablePrice = (shape: string, length: number): number => {
  if (shape === 'RECTANGLE' || shape === 'CAPSULE' || shape === 'OBLONG' || shape === 'OVAL') {
    if (length >= 1600 && length <= 2200) return 2880
    if (length >= 2250 && length <= 2450) return 3312
    if (length >= 2500 && length <= 2850) return 3576
    if (length >= 2900 && length <= 3180) return 3840
  }

  if (shape === 'SQUARE') {
    if (length === 1200) return 2190
    if (length === 1300) return 2380
    if (length === 1400) return 2650
    if (length === 1500 || length === 1580) return 2880
  }

  if (shape === 'ROUND') {
    if (length === 1200) return 2290
    if (length === 1300) return 2480
    if (length === 1400) return 2750
    if (length === 1500 || length === 1580) return 2980
  }

  return 0
}

type StoreSnapshot = {
  baseId: BaseId
  baseColorId: string | null
  topId: TopId
  topColorId: string | null
  topLength: number
  topWidth: number
  chairId: ChairId | null
  chairColorId: string | null
  chairQty: number
}

export const getBuildSummary = (store: StoreSnapshot) => {
  const baseName = BASE_OPTIONS.find(b => b.id === store.baseId)?.title || store.baseId
  const baseColor = BASE_COLOR_OPTIONS[store.baseId]?.find(c => c.id === store.baseColorId)?.title || 'N/A'
  const topShape = TOP_OPTIONS.find(t => t.id === store.topId)?.label || store.topId
  const topColor = TOP_COLORS.find(c => c.id === store.topColorId)?.title || 'N/A'
  const chairName = CHAIR_OPTIONS.find(c => c.id === store.chairId)?.title || 'N/A'
  const chairColor = store.chairId
    ? CHAIR_COLOR_OPTIONS[store.chairId]?.find(c => c.id === store.chairColorId)?.title || 'N/A'
    : 'N/A'

  const tablePrice = getTablePrice(store.topId, store.topLength)
  const chairPairs = Math.floor(store.chairQty / 2)
  const chairsPrice = chairPairs * 200
  const total = tablePrice + chairsPrice

  return {
    baseName,
    baseColor,
    topShape,
    topColor,
    chairName,
    chairColor,
    tablePrice,
    chairsPrice,
    total
  }
}

export const formatGBP = (value: number) => `£${value.toFixed(2)}`
