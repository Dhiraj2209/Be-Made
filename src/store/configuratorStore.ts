import { makeAutoObservable, runInAction } from 'mobx'
import type { BaseId, ChairId, ConfigStep, TopId } from '../types/configurator'
import { BASE_COLOR_OPTIONS } from '../data/baseColors'
import { TOP_COLORS } from '../data/topColors'
import { TOP_OPTIONS } from '../data/topOptions'
import { CHAIR_COLOR_OPTIONS } from '../data/ChairColorOptions'
import type { CameraView } from '../canvas/cameraViewHelper'
import { getMaxChairs } from "./../data/seatingCapacity"; 
// import { TopLengthManager } from '../managers/TopLengthManager'


type CameraViewId = CameraView['id']


class ConfiguratorStore {
  currentStep: ConfigStep = 'BASE'

  baseId: BaseId = 'LINEA'
  baseColorId: string | null = null

  topId: TopId = 'RECTANGLE'
  topColorId: string | null = null

  topLength = 0
  topWidth = 0

chairId: ChairId | null = null
  chairColorId: string | null = null
  chairQty = 0
  preferredViewId: CameraViewId = 'front_view'
  viewPreferenceVersion = 0
  canvasSnapshot: string | null = null
  canvasSnapshotRequestVersion = 0

  constructor() {
    makeAutoObservable(this)

    // Base default
    const baseColors = BASE_COLOR_OPTIONS[this.baseId]
    this.baseColorId = baseColors?.[0]?.id ?? null

    // Top default color
    this.topColorId = TOP_COLORS[0]?.id ?? null

    // Apply default size
    this.applyTopDefaults()
    this.setPreferredView('front_view')
  }

  // -------- TOP LOGIC --------

  get currentTopOption() {
    return TOP_OPTIONS.find(t => t.id === this.topId)
  }

  isTopShapeAllowed(id: TopId) {
    const isLineaDome = this.baseId === 'LINEA_DOME'

    if (isLineaDome) {
      return id === 'ROUND' || id === 'SQUARE'
    }

    return id !== 'ROUND' && id !== 'SQUARE'
  }

  setTop(id: TopId) {
    if (!this.isTopShapeAllowed(id)) return

    this.topId = id
    this.applyTopDefaults()
    this.setPreferredView('top_view')
  }
  applyTopDefaults() {
    const top = this.currentTopOption
    if (!top) return

    this.topLength = top.defaultLength
    this.topWidth = top.defaultWidth
  }

  setTopLength(val: number) {
    const top = this.currentTopOption
    if (!top) return

    this.topLength = Math.min(
      Math.max(val, top.minLength),
      top.maxLength
    )

  }

  setTopWidth(val: number) {
    const top = this.currentTopOption
    if (!top) return

    this.topWidth = Math.min(
      Math.max(val, top.minWidth),
      top.maxWidth
    )
  }

  setTopColor(id: string) {
    this.topColorId = id
    this.setPreferredView('top_view')
  }

  // -------- BASE --------

  setBase(id: BaseId) {
    this.baseId = id

    if (!this.isTopShapeAllowed(this.topId)) {
      this.topId = id === 'LINEA_DOME' ? 'ROUND' : 'RECTANGLE'
      this.applyTopDefaults()
    }

    const baseColors = BASE_COLOR_OPTIONS[this.baseId]
    this.baseColorId = baseColors?.[0]?.id ?? null
    // this.topLength = TopLengthManager.clampLengthForBase(this.baseId, this.topLength)
    this.setPreferredView('front_view')
  }

  setBaseColor(id: string) {
    this.baseColorId = id
    this.setPreferredView('front_view')
  }
// -------- CHAIR LOGIC --------

setChair(id: ChairId) {
  this.chairId = id;

  const availableColors = CHAIR_COLOR_OPTIONS[id] ?? [];
  this.chairColorId = availableColors[0]?.id ?? null;

  if (this.chairQty < 1) {
    this.chairQty = 2;
  }
  this.setPreferredView('chair_view')
}

  setChairColor(id: string) {
    this.chairColorId = id;
  }
// Add this helper to your ConfiguratorStore class
get maxRecommendedChairs() {
  if (this.topId === 'ROUND') {
    if (this.topLength <= 1300) return 6;
    if (this.topLength <= 1500) return 7;
    return 8;
  }
  return 12; // Default for larger tables
}

setChairQty(qty: number) {
  const { max } = getMaxChairs(this.topLength);

  this.chairQty = Math.min(qty, max);
}

  // -------- STEP --------

  setStep(step: ConfigStep) {
    this.currentStep = step
  }


  setPreferredView(viewId: CameraViewId) {
    runInAction(() => {
      this.preferredViewId = viewId
      this.viewPreferenceVersion += 1
    })
  }

  setCanvasSnapshot(dataUrl: string) {
    this.canvasSnapshot = dataUrl
  }

  requestCanvasSnapshot() {
    runInAction(() => {
      this.canvasSnapshotRequestVersion += 1
    })
  }
}

export const configuratorStore = new ConfiguratorStore()
