import './optionGrid.css'
import { observer } from 'mobx-react-lite'
import { configuratorStore } from '../../store/configuratorStore'
import { BASE_OPTIONS } from '../../data/baseOptions'
import { OptionCard } from './OptionCard'

export const OptionGrid = observer(() => {
  return (
    <div className="option-grid">
      {BASE_OPTIONS.map(base => (
        <OptionCard
          key={base.id}
          title={base.title}
          image={base.image}
          active={configuratorStore.baseId === base.id}
          onClick={() => configuratorStore.setBase(base.id)}
        />
      ))}
    </div>
  )
})
