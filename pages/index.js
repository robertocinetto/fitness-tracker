import Layout from '../components/Layout'
import { themeState } from '../atom/themeAtom'
import { useRecoilState } from 'recoil'

const Home = ({ demoRecords }) => {
  const [theme, setTheme] = useRecoilState(themeState)

  return (
    <div className={`${theme ? 'dark' : 'light'}`}>
      <Layout demoRecords={demoRecords} />
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
