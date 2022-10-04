import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, demoRecords }) => {
  return (
    <div className="bg-white dark:bg-slate-800 dark:text-slate-100 dark:dark-theme">
      <div className="shadow-sm border-b sticky top-0 z-30 bg-white dark:bg-slate-900 dark:border-slate-800 ">
        <Header />
      </div>
      <main className="max-w-screen-2xl mx-auto px-5">{children}</main>

      <Footer />
    </div>
  )
}

export default Layout
