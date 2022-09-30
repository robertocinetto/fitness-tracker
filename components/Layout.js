import BodyCompositionForm from './BodyCompositionForm'
import FitnessDataTable from './FitnessDataTable'
import Graphs from './Graphs'

import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, demoRecords }) => {
  return (
    <div className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:dark-theme">
      <div className="shadow-sm border-b sticky top-0 z-30 bg-white dark:bg-slate-900 dark:border-slate-800 ">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto pt-10 px-5 ">
        <BodyCompositionForm />
      </div>
      <div className="max-w-7xl mx-auto py-10 px-5 card">
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
