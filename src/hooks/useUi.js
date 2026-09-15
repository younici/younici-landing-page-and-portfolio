import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Moves the specular highlight of a .interactive surface with the pointer. */
export function setSheen(event) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

/** Live element height (used to let the view stack resize itself). */
export function useMeasuredHeight(ref, deps = []) {
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
      setHeight((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    })
    observer.observe(node)
    setHeight(node.getBoundingClientRect().height)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps])

  return height
}

/** Locks page scroll while a modal is open, without the layout jumping. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const { body } = document
    const gap = window.innerWidth - document.documentElement.clientWidth
    const previousPadding = body.style.paddingRight
    body.classList.add('is-locked')
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.classList.remove('is-locked')
      body.style.paddingRight = previousPadding
    }
  }, [active])
}

/** `true` for ~1.6s after being triggered — for "Copied" style feedback. */
export function useFlag(duration = 1600) {
  const [on, setOn] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  return [
    on,
    () => {
      setOn(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setOn(false), duration)
    },
  ]
}
