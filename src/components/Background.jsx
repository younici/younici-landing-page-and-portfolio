import { useEffect, useRef, useState } from 'react'

import bgUrl from '../../images/first_bg.jpeg'

/**
 * Fixed photo + gradient scrim + accent glows that follow the active view,
 * a soft light that trails the cursor and a film-grain layer. Everything is
 * driven by CSS custom properties written on <html>, so no React re-renders
 * happen while scrolling or moving the mouse.
 */
export default function Background() {
  const [loaded, setLoaded] = useState(false)
  const [pointing, setPointing] = useState(false)
  const pointingRef = useRef(false)

  useEffect(() => {
    const image = new Image()
    const done = () => setLoaded(true)
    image.onload = done
    image.onerror = done
    image.src = bgUrl
    if (image.complete) done()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    let scrollY = window.scrollY
    let x = null
    let y = null

    const apply = () => {
      frame = 0
      root.style.setProperty('--sy', String(scrollY))
      if (x !== null) {
        root.style.setProperty('--px', `${x}px`)
        root.style.setProperty('--py', `${y}px`)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onScroll = () => {
      scrollY = window.scrollY
      schedule()
    }
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      x = event.clientX
      y = event.clientY
      if (!pointingRef.current) {
        pointingRef.current = true
        setPointing(true)
      }
      schedule()
    }
    const onLeave = () => {
      pointingRef.current = false
      setPointing(false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      className={`bg${loaded ? ' is-loaded' : ''}${pointing ? ' is-pointing' : ''}`}
      aria-hidden="true"
    >
      <div className="bg__photo" style={{ backgroundImage: `url(${bgUrl})` }} />
      <div className="bg__glow bg__glow--cool" />
      <div className="bg__glow bg__glow--warm" />
      <div className="bg__scrim" />
      <div className="bg__cursor" />
      <div className="bg__grain" />
    </div>
  )
}
