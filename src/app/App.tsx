import { Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { CreateRoomPage } from '../features/date-fix/pages/CreateRoomPage'
import { MainPage } from '../features/date-fix/pages/MainPage'
import { RoomOverlapPage } from '../features/date-fix/pages/RoomOverlapPage'
import { AppStatusPage } from '../features/date-fix/pages/AppStatusPage'
import { RoomPage } from '../features/date-fix/pages/RoomPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<MainPage />} />
        <Route path="status" element={<AppStatusPage />} />
        <Route path="create" element={<CreateRoomPage />} />
        <Route path="room/:roomId" element={<RoomPage />} />
        <Route path="room/:roomId/overlap" element={<RoomOverlapPage />} />
      </Route>
    </Routes>
  )
}
