import { useCallback, useLayoutEffect, useRef } from 'react'

import '../styles/segmented.css'

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

/** Resistance past the first/last slot, so the ends feel elastic. */
const rubber = (p, max) => {
  if (p < 0) return p * 0.3
  if (p > max) return max + (p - max) * 0.3
  return p
}

/**
 * iOS-style segmented control: tap a label to slide there, or grab the glass
 * thumb and drag it. While dragging, `onProgress` reports the fractional
 * position so the page theme can follow the finger.
 */
export default function GlassSegmented({
  options,
  value,
  onChange,
  onProgress,
  onDragStateChange,
  size = 'md',
  role = 'tablist',
  material = 'glass', // 'glass' on the page itself, 'gloss' when nested in glass
  ariaLabel,
  idPrefix = 'seg',
  className = '',
}) {
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(0)

  const count = options.length
  const max = count - 1
  const foundIndex = options.findIndex((option) => option.value === value)
  const index = foundIndex === -1 ? 0 : foundIndex
  const itemRole = role === 'tablist' ? 'tab' : 'radio'

  const setVars = useCallback((p, sx = 1, sy = 1) => {
    const track = trackRef.current
    if (!track) return
    track.style.setProperty('--p', String(p))
    track.style.setProperty('--sx', String(sx))
    track.style.setProperty('--sy', String(sy))
  }, [])

  // resting position always follows `value`
  useLayoutEffect(() => {
    if (dragRef.current) return
    setVars(index)
  }, [index, setVars])

  const metrics = () => {
    const track = trackRef.current
    const rect = track.getBoundingClientRect()
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0
    const step = (rect.width - pad * 2) / count
    return { rect, pad, step: step || 1 }
  }

  const endDrag = useCallback(
    (commit) => {
      const drag = dragRef.current
      const track = trackRef.current
      if (!drag || !track) return
      dragRef.current = null

      track.classList.remove('is-dragging')
      try {
        track.releasePointerCapture(drag.id)
      } catch {
        /* pointer already gone */
      }

      let target = index
      if (commit) {
        const p = clamp(drag.p, 0, max)
        target = Math.round(p)
        // a flick carries the thumb one slot further, even from a short drag
        if (drag.moved && Math.abs(drag.v) > 0.3) {
          target = drag.v > 0 ? Math.min(max, Math.floor(p) + 1) : Math.max(0, Math.ceil(p) - 1)
        }
      }

      setVars(target)
      if (drag.moved) suppressClickRef.current = performance.now() + 300

      if (options[target] && options[target].value !== value) onChange?.(options[target].value)
      onDragStateChange?.(false)
    },
    [index, max, onChange, onDragStateChange, options, setVars, value],
  )

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const track = trackRef.current
    if (!track || dragRef.current) return

    const { rect, pad, step } = metrics()
    const x = event.clientX - rect.left - pad
    const onThumb = x >= index * step && x <= (index + 1) * step
    if (!onThumb) return // tapping another label is a plain click

    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startP: index,
      p: index,
      lastX: event.clientX,
      lastT: event.timeStamp,
      v: 0,
      moved: false,
      step,
    }
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || event.pointerId !== drag.id) return

    const dx = event.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(dx) < 2) return
      drag.moved = true
      track.classList.add('is-dragging')
      try {
        track.setPointerCapture(drag.id)
      } catch {
        /* capture is a nicety, dragging still works without it */
      }
      onDragStateChange?.(true)
    }

    const dt = Math.max(1, event.timeStamp - drag.lastT)
    drag.v = (event.clientX - drag.lastX) / dt
    drag.lastX = event.clientX
    drag.lastT = event.timeStamp

    const raw = drag.startP + dx / drag.step
    const p = rubber(raw, max)
    drag.p = p

    // liquid stretch: speed makes it wide and thin, hitting the end squishes it
    const speed = Math.min(0.055, Math.abs(drag.v) * 0.085)
    const over = Math.min(0.07, Math.abs(p - clamp(p, 0, max)) * 0.5)
    setVars(p, 1 + speed + over, 1 - speed * 0.75 - over)
    onProgress?.(clamp(p, 0, max))
  }

  const handlePointerUp = (event) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    if (!drag.moved) {
      dragRef.current = null
      return
    }
    endDrag(true)
  }

  const handlePointerCancel = (event) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    if (!drag.moved) {
      dragRef.current = null
      return
    }
    endDrag(false)
  }

  const handleClick = (nextValue) => {
    if (performance.now() < suppressClickRef.current) return
    if (nextValue !== value) onChange?.(nextValue)
  }

  const handleKeyDown = (event) => {
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(max, index + 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, index - 1)
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = max
    if (next === null) return
    event.preventDefault()
    if (options[next].value !== value) onChange?.(options[next].value)
    // ARIA pattern: the roving tabindex follows the selection
    trackRef.current
      ?.querySelector(`#${idPrefix}-${CSS.escape(options[next].value)}`)
      ?.focus({ preventScroll: true })
  }

  return (
    <div
      ref={trackRef}
      className={`seg surface ${material} r-pill seg--${size} ${className}`.trim()}
      style={{ '--count': count }}
      role={role}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
    >
      <span className="seg__thumb surface gloss gloss--raised r-pill" aria-hidden="true">
        <span className="seg__grip">
          <i />
          <i />
          <i />
        </span>
      </span>

      {options.map((option, i) => {
        const active = i === index
        return (
          <button
            key={option.value}
            type="button"
            className="seg__item"
            style={{ '--i': i }}
            role={itemRole}
            id={`${idPrefix}-${option.value}`}
            aria-controls={option.controls}
            aria-selected={itemRole === 'tab' ? active : undefined}
            aria-checked={itemRole === 'radio' ? active : undefined}
            aria-label={option.ariaLabel}
            tabIndex={active ? 0 : -1}
            data-active={active}
            onClick={() => handleClick(option.value)}
          >
            <span className="seg__label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
