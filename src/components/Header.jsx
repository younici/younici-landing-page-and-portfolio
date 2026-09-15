import { useEffect, useState } from 'react'

import { useI18n } from '../i18n/index.jsx'
import GlassSegmented from './GlassSegmented.jsx'
import '../styles/header.css'

export default function Header({ view, onViewChange, onProgress, onDragStateChange }) {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const options = [
    { value: 'landing', label: t.nav.landing, controls: 'view-landing' },
    { value: 'portfolio', label: t.nav.portfolio, controls: 'view-portfolio' },
  ]

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="site-header__inner">
        <GlassSegmented
          options={options}
          value={view}
          onChange={onViewChange}
          onProgress={onProgress}
          onDragStateChange={onDragStateChange}
          ariaLabel={t.nav.aria}
          idPrefix="views"
          className="seg--views"
        />
      </div>
    </header>
  )
}
