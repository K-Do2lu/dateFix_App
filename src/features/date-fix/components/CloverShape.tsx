type CloverShapeProps = {
  className?: string
  fill?: string
}

/** 네잎클로버 실루엣 (4개 원형 잎) */
export function CloverShape({ className = 'h-9 w-9', fill = '#e5e5e5' }: CloverShapeProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`rotate-45 ${className}`}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="20" cy="11" rx="9.5" ry="11" fill={fill} />
      <ellipse cx="20" cy="29" rx="9.5" ry="11" fill={fill} />
      <ellipse cx="11" cy="20" rx="11" ry="9.5" fill={fill} />
      <ellipse cx="29" cy="20" rx="11" ry="9.5" fill={fill} />
    </svg>
  )
}
