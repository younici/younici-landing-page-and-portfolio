import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { I18nProvider } from '../i18n/index.jsx'
import Landing from './Landing.jsx'

describe('Landing', () => {
  it('renders the main heading', () => {
    const github = { user: null, repos: [], status: 'loading' }
    render(
      <I18nProvider>
        <Landing github={github} onViewChange={() => {}} />
      </I18nProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
