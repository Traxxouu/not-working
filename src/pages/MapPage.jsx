import { Map } from '../components/map/Map'
import { mockReports } from '../data/mockReports'

export const MapPage = () => (
  <div className="h-[calc(100vh-4rem)]">
    <Map reports={mockReports} />
  </div>
)
