export type GuideStepId = 'welcome' | 'invite' | 'pick' | 'overlap' | 'celebrate'

export type GuideStep = {
  id: GuideStepId
  title: string
  description: string
}

export const APP_GUIDE_STEPS: GuideStep[] = [
  {
    id: 'welcome',
    title: '우리 날짜를 함께 정해요',
    description: 'Date Fix는 친구들과 만날 수 있는 날을 찾는 앱이에요.',
  },
  {
    id: 'invite',
    title: '1. 친구 초대',
    description: '방을 만든 뒤 초대 링크를 복사해 친구에게 보내요.',
  },
  {
    id: 'pick',
    title: '2. 각자 날짜 선택',
    description: '나와 친구가 캘린더에서 만날 수 있는 날을 골라요.',
  },
  {
    id: 'overlap',
    title: '3. 만날 날 고르기',
    description: '겹치는 날 중 하나를 골라요. 모두 가능한 날만 보여 줘요.',
  },
  {
    id: 'celebrate',
    title: '4. 약속 확정',
    description: '시간을 정하고 확정하면 야호~! 메인에서 약속을 확인할 수 있어요.',
  },
]
