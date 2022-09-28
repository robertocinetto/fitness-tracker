import BodyCompositionForm from './BodyCompositionForm'
import FitnessDataTable from './FitnessDataTable'
import Graphs from './Graphs'

import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, demoRecords }) => {
  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto py-10 px-5">
        <BodyCompositionForm />
      </div>
      <div className="max-w-7xl mx-auto py-10 px-5">
        <FitnessDataTable demoRecords={demoRecords} />
      </div>
      <div className="max-w-7xl mx-auto py-10 px-5">
        <Graphs />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
