import { RootLayout } from '@/components/layout/RootLayout'
import Home from '@/pages/Home'

/** The portfolio is a single page: every section lives on the home page. */
export default function App() {
  return (
    <RootLayout>
      <Home />
    </RootLayout>
  )
}
