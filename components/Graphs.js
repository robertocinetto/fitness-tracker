import { Chart } from 'primereact/chart'
import { useEffect, useState } from 'react'

import { useRecoilState } from 'recoil'
import { recordsState } from '../atom/recordsAtom'

const Graphs = () => {
  const [records] = useRecoilState(recordsState)
  const [graphData, setGraphData] = useState({})

  useEffect(() => {
    setGraphData({
      labels: records.map(record =>
        record.recordDate.toDate().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'numeric',
          year: '2-digit',
        })
      ),
      datasets: [
        {
          label: 'Weight',
          data: records.map(record => record.weight),
          fill: false,
          borderColor: '#f5ec42',
          tension: 0.4,
        },
        {
          label: 'BMI',
          data: records.map(record => record.bmi),
          fill: false,
          borderColor: '#42f54b',
          tension: 0.4,
        },
        {
          label: 'Fat %',
          data: records.map(record => record.fatPercentage),
          fill: false,
          borderColor: '#f59942',
          tension: 0.4,
        },
        {
          label: 'Water %',
          data: records.map(record => record.waterPercentage),
          fill: false,
          borderColor: '#4266f5',
          tension: 0.4,
        },
      ],
    })
  }, [records])

  return (
    <div>
      <Chart
        type="line"
        data={graphData}
      />
    </div>
  )
}

export default Graphs
