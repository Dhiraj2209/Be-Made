import './optionCard.css'
import { CheckCircle2 } from 'lucide-react'

type OptionCardProps = {
  title: string
  image: string
  active: boolean
  onClick: () => void
}

export const OptionCard = ({
  title,
  image,
  active,
  onClick,
}: OptionCardProps) => {
  return (
    <div
      className={`option-card ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="option-image-wrapper">
        <img src={image} alt={title} />
        {active && <CheckCircle2 className="unified-selected-icon" />}
      </div>

      <div className="option-label">{title}</div>
    </div>
  )
}
