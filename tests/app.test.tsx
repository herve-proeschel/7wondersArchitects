import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'

function renderApp() {
  return render(<App />)
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.lang = 'en'
  document.head.innerHTML = '<meta name="theme-color" content="#121211" />'
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('7 Wonders assignment app', () => {
  it('adds, removes, and clears players', () => {
    renderApp()
    expect(screen.getByText('Add at least 2 players.')).toBeInTheDocument()

    const input = screen.getByRole('textbox', { name: 'Player name' })
    fireEvent.change(input, { target: { value: ' Ada ' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)
    fireEvent.change(input, { target: { value: 'Grace' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)

    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer Ada' }))
    expect(screen.queryByText('Ada')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText('Add at least 2 players.')).toBeInTheDocument()
  })

  it('switches extensions and draws localized assignments', () => {
    renderApp()
    const input = screen.getByRole('textbox', { name: 'Player name' })
    for (const name of ['Ada', 'Grace']) {
      fireEvent.change(input, { target: { value: name } })
      fireEvent.submit(input.closest('form') as HTMLFormElement)
    }

    const draw = screen.getByRole('button', { name: 'Draw wonders' })
    expect(draw).toBeEnabled()
    fireEvent.click(draw)
    expect(screen.getByRole('button', { name: 'Draw again' })).toBeInTheDocument()
    expect(screen.getByLabelText('First player')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Classic' }))
    expect(screen.getByRole('button', { name: /Cities/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: /Cities/ }))
    expect(screen.getByRole('button', { name: /Cities/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    fireEvent.click(screen.getByRole('button', { name: /Wonder Pack/ }))
    expect(screen.getByRole('button', { name: /Wonder Pack/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Architects' }))
    fireEvent.click(screen.getByRole('button', { name: /Medals/ }))
    expect(screen.getByRole('button', { name: /Medals/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('handles settings, language, theme, and outside clicks', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /More|Mehr/ }))
    expect(document.querySelector('.settings-menu-panel')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'DE' }))
    expect(document.documentElement.lang).toBe('de')
    expect(document.querySelector('.settings-menu-panel')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /More|Mehr/ }))
    fireEvent.click(screen.getByRole('button', { name: /Dark|Dunkel/ }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.querySelector('.settings-menu-panel')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /More|Mehr/ }))
    fireEvent.pointerDown(document.body)
    expect(document.querySelector('.settings-menu-panel')).not.toBeInTheDocument()
  })

  it('shows the maximum-player state and leaves draw disabled when over capacity', () => {
    localStorage.setItem(
      '7w_players_fs',
      JSON.stringify(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
    )
    renderApp()
    expect(screen.getByText(/maximum|exceeds/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Draw wonders|Wunder ziehen/ })).toBeDisabled()
    expect(screen.getByText(/10\s*\/\s*9/)).toBeInTheDocument()
  })

  it('renders result cards and keeps settings content grouped', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /More|Mehr/ }))
    const panel = document.querySelector('.settings-menu-panel') as HTMLElement
    expect(within(panel).getByText(/About|Über/)).toBeInTheDocument()
    expect(within(panel).getByText(/GitHub project|GitHub-Projekt/)).toHaveAttribute(
      'href',
      'https://github.com/herve-proeschel/7wondersArchitects',
    )
    expect(within(panel).getByText(/Commit:/)).toBeInTheDocument()
  })
})