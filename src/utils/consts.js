import TooLowIcon from '../assets/icons/blood-sugar/too-low.svg'
import LowIcon from '../assets/icons/blood-sugar/low.svg'
import OnTargetIcon from '../assets/icons/blood-sugar/on-target.svg'
import HighIcon from '../assets/icons/blood-sugar/high.svg'
import TooHighIcon from '../assets/icons/blood-sugar/too-high.svg'

export const bloodSugarOptions = [
    { label: 'Too low', value: 'too-low', color: '#ef4444', icon: TooLowIcon },
    { label: 'Low', value: 'low', color: '#f97316', icon: LowIcon },
    { label: 'On target', value: 'on-target', color: '#22c55e', icon: OnTargetIcon },
    { label: 'High', value: 'high', color: '#f97316', icon: HighIcon },
    { label: 'Too high', value: 'too-high', color: '#ef4444', icon: TooHighIcon }
]