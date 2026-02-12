import { observer } from 'mobx-react-lite'
import { OptionGrid } from '../components/OptionGrid/OptionGrid'
import './basePanel.css'

export const BasePanel = observer(() => {
  return (
    <div className="base-panel">
      <h2 className="panel-title">Choose Base</h2>
      <OptionGrid />
    </div>
  )
})
