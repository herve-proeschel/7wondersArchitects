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

function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return
  }

  const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`
  let isReloading = false

  const requestActivation = (registration: ServiceWorkerRegistration) => {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
  }

  const requestUpdate = (registration: ServiceWorkerRegistration) => {
    void registration.update().catch(() => undefined)
  }

  const monitorInstallingWorker = (registration: ServiceWorkerRegistration) => {
    const installingWorker = registration.installing

    if (!installingWorker) {
      return
    }

    installingWorker.addEventListener('statechange', () => {
      if (
        installingWorker.state === 'installed' &&
        navigator.serviceWorker.controller
      ) {
        requestActivation(registration)
      }
    })
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isReloading) {
      return
    }

    isReloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(serviceWorkerUrl, { scope: import.meta.env.BASE_URL })
      .then((registration) => {
        if (registration.waiting) {
          requestActivation(registration)
        }

        monitorInstallingWorker(registration)
        registration.addEventListener('updatefound', () => {
          monitorInstallingWorker(registration)
        })

        requestUpdate(registration)

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            requestUpdate(registration)
          }
        })

        window.addEventListener('online', () => {
          requestUpdate(registration)
        })
      })
      .catch(() => undefined)
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>,
)

registerServiceWorker()
