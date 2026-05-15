import { CuteButtonLink } from '../../../components/ui/CuteButtonLink'
import { HomeBanner } from '../components/HomeBanner'
import { RoomListSection } from '../components/RoomListSection'

export function MainPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <HomeBanner />

      <section className="flex min-h-0 flex-1 flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <CuteButtonLink to="/create" variant="primary" size="lg" className="max-w-sm shrink-0 self-center">
          날짜 정하기
        </CuteButtonLink>

        <div className="mx-auto mt-6 w-full max-w-sm flex-1">
          <RoomListSection />
        </div>
      </section>
    </div>
  )
}
