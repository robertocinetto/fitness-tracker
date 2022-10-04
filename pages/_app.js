import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'next-themes'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default MyApp
