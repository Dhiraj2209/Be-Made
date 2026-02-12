import './stepTabs.css'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { configuratorStore } from '../../store/configuratorStore'
import type { ConfigStep } from '../../types/configurator'

const steps: { id: ConfigStep; label: string }[] = [
  { id: 'BASE', label: 'BASE' },
  { id: 'BASE_COLOR', label: 'BASE COLOUR' },
  { id: 'TOP_COLOR', label: 'TOP COLOUR' },
  { id: 'TOP_SHAPE', label: 'TOP SHAPE' },
  { id: 'DIMENSION', label: 'DIMENSION' },
  { id: 'CHAIR', label: 'CHAIRS' },
  { id: 'SUMMARY', label: 'SUMMARY' },
]

// export const StepTabs = observer(() => {
//   return (
//     <div className="step-tabs">
//       {steps.map(step => (
//         <div
//           key={step.id}
//           className={`step ${
//             configuratorStore.currentStep === step.id ? 'active' : ''
//           }`}
//           onClick={() => configuratorStore.setStep(step.id)}
//         >
//           {step.label}
//         </div>
//       ))}
//     </div>
//   )
// })

export const StepTabs = observer(() => {
  useEffect(() => {
    const container = document.getElementById('rightPanel')
    if (!container) return

    const updateActiveStepFromScroll = () => {
      const marker = container.scrollTop + 140
      let current: ConfigStep = steps[0].id

      for (const step of steps) {
        const section = document.getElementById(step.id)
        if (!section) continue
        if (section.offsetTop <= marker) {
          current = step.id
        }
      }

      if (configuratorStore.currentStep !== current) {
        configuratorStore.setStep(current)
      }
    }

    updateActiveStepFromScroll()
    container.addEventListener('scroll', updateActiveStepFromScroll, { passive: true })
    return () => container.removeEventListener('scroll', updateActiveStepFromScroll)
  }, [])

  const handleClick = (stepId: ConfigStep) => {
    configuratorStore.setStep(stepId)

    const element = document.getElementById(stepId)
    const container = document.getElementById('rightPanel')

    if (element && container) {
      container.scrollTo({
        top: element.offsetTop -110,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="step-tabs">
      {steps.map(step => (
        <div
          key={step.id}
          className={`step ${
            configuratorStore.currentStep === step.id ? 'active' : ''
          }`}
          onClick={() => handleClick(step.id)}
        >
          {step.label}
        </div>
      ))}
    </div>
  )
})
