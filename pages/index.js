import BodyCompositionForm from '../components/BodyCompositionForm'
import FitnessDataTable from '../components/FitnessDataTable'
import Graphs from '../components/Graphs'

const Home = ({ demoRecords }) => {
  return (
    <div>
      <div className="mt-10">
        <BodyCompositionForm />
      </div>
      <div className="my-10 card">
        <FitnessDataTable demoRecords={demoRecords} />
      </div>
      <div className="my-10">
        <Graphs />
      </div>
    </div>
  )
}

import fsPromises from 'fs/promises'
import path from 'path'

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'api/fitnessData.json')
  const jsonData = await fsPromises.readFile(filePath)
  const demoRecords = JSON.parse(jsonData).data

  return {
    props: {
      demoRecords,
    },
  }
}

export default Home
