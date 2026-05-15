/** iMessage 스타일 입력 중 점 3개 */
export function SplashTypingIndicator() {
  return (
    <div
      className="splash-typing flex items-center gap-1 rounded-[1.125rem] bg-[#E9E9EB] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      aria-hidden
    >
      <span className="splash-typing-dot" />
      <span className="splash-typing-dot splash-typing-dot-2" />
      <span className="splash-typing-dot splash-typing-dot-3" />
    </div>
  )
}
