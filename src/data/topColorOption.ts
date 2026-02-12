import type { TopId } from '../types/configurator'
import { TOP_COLORS } from './topColors'

export const TOP_COLOR_OPTIONS: Record<TopId, typeof TOP_COLORS> = {
  RECTANGLE: TOP_COLORS,
  CAPSULE: TOP_COLORS,
  OVAL: TOP_COLORS,
  OBLONG: TOP_COLORS,
  ROUND: TOP_COLORS,
  SQUARE: TOP_COLORS,
}
