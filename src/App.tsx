import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes'
import { AuthProvider, ThemeProvider, ToastProvider, BlockchainIntegrityProvider } from './providers'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BlockchainIntegrityProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </BlockchainIntegrityProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
