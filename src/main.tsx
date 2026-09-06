import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

type ErrorBoundaryState = {
  hasError: boolean
  message: string
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application crash', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <h1>Impossible de charger l&apos;application</h1>
          <p>{this.state.message || 'Erreur inconnue'}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Recharger
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>,
)

if ('serviceWorker' in navigator) {
  void navigator.serviceWorker
    .register(`${import.meta.env.BASE_URL}sw.js`)
    .catch(() => undefined)
}
