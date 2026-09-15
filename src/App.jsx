import { useCallback, useEffect, useRef, useState } from 'react'

import Background from './components/Background.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Landing from './components/Landing.jsx'
import Portfolio from './components/Portfolio.jsx'
import ProjectModal from './components/ProjectModal.jsx'
import { useGitHub } from './hooks/useGitHub.js'
import { useMeasuredHeight } from './hooks/useUi.js'

export default function App() {
  const github = useGitHub()
  const [view, setView] = useState('landing')
  const [activeRepo, setActiveRepo] = useState(null)
  // the grid gets its staggered reveal once, and only on a tap (a drag already
  // moves the cards under the finger, so a second animation would fight it)
  const [stagger, setStagger] = useState(false)
  const seenPortfolioRef = useRef(false)
  const draggingRef = useRef(false)
  const staggerTimerRef = useRef(null)

  const landingRef = useRef(null)
  const portfolioRef = useRef(null)
  const landingHeight = useMeasuredHeight(landingRef)
  const portfolioHeight = useMeasuredHeight(portfolioRef)
  const height = view === 'landing' ? landingHeight : portfolioHeight

  useEffect(() => () => clearTimeout(staggerTimerRef.current), [])

  /** Commit a view change: data-view drives every accent colour on the page. */
  const changeView = useCallback((next) => {
    document.documentElement.dataset.view = next
    setView(next)

    if (next === 'portfolio' && !seenPortfolioRef.current) {
      seenPortfolioRef.current = true
      if (!draggingRef.current) {
        setStagger(true)
        clearTimeout(staggerTimerRef.current)
        staggerTimerRef.current = setTimeout(() => setStagger(false), 1100)
      }
    }

    if (window.scrollY > 4) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    }
  }, [])

  /** Live drag position of the header thumb — the theme follows the finger. */
  const handleProgress = useCallback((progress) => {
    document.documentElement.style.setProperty('--vp', String(progress))
  }, [])

  const handleDragState = useCallback((dragging) => {
    const root = document.documentElement
    draggingRef.current = dragging
    if (dragging) {
      root.classList.add('is-sliding')
    } else {
      // hand control back to the CSS transition, which springs to data-view
      root.classList.remove('is-sliding')
      root.style.removeProperty('--vp')
    }
  }, [])

  return (
    <>
      <Background />

      <div className="app">
        <Header
          view={view}
          onViewChange={changeView}
          onProgress={handleProgress}
          onDragStateChange={handleDragState}
        />

        <main className="app__main">
          <div className="stack" style={height ? { height: `${height}px` } : undefined}>
            <div
              ref={landingRef}
              id="view-landing"
              className="stack__layer stack__layer--landing"
              role="tabpanel"
              aria-labelledby="views-landing"
              data-active={view === 'landing'}
              inert={view !== 'landing'}
            >
              <Landing github={github} onViewChange={changeView} />
            </div>

            <div
              ref={portfolioRef}
              id="view-portfolio"
              className="stack__layer stack__layer--portfolio"
              role="tabpanel"
              aria-labelledby="views-portfolio"
              data-active={view === 'portfolio'}
              data-stagger={stagger}
              inert={view !== 'portfolio'}
            >
              <Portfolio github={github} onOpen={setActiveRepo} />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {activeRepo ? (
        <ProjectModal repo={activeRepo} onClose={() => setActiveRepo(null)} />
      ) : null}
    </>
  )
}
