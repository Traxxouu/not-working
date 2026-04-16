import { Map } from '../components/map/Map'
import { mockReports } from '../data/mockReports'

export const MapPage = () => (
  <div style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
    <Map reports={mockReports} />
  </div>
)