import { Mascot } from './Mascot'

type AppIconProps = {
  size?: 'lg' | 'md'
}

export function AppIcon({ size = 'lg' }: AppIconProps) {
  return <Mascot size={size === 'lg' ? 'lg' : 'md'} />
}
