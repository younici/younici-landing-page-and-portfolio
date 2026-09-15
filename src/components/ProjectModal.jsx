import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { languageColor, makeUrlTransform, useReadme } from '../hooks/useGitHub.js'
import { useI18n } from '../i18n/index.jsx'
import { setSheen, useScrollLock } from '../hooks/useUi.js'
import {
  BookIcon,
  ClockIcon,
  CloseIcon,
  ExternalIcon,
  ForkIcon,
  GitHubIcon,
  GlobeIcon,
  StarIcon,
} from './Icons.jsx'
import '../styles/modal.css'
import '../styles/markdown.css'

const EXIT_MS = 240
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const markdownComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
  img: ({ node, alt, ...props }) => <img {...props} alt={alt || ''} loading="lazy" />,
  input: ({ node, ...props }) => <input {...props} disabled readOnly />,
}

export default function ProjectModal({ repo, onClose }) {
  const { t, formatDate, formatNumber } = useI18n()
  const readme = useReadme(repo)
  const [closing, setClosing] = useState(false)

  const sheetRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)
  const timerRef = useRef(null)

  useScrollLock(true)

  const requestClose = useCallback(() => {
    setClosing(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(onClose, EXIT_MS)
  }, [onClose])

  useEffect(() => {
    restoreRef.current = document.activeElement
    closeRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        requestClose()
        return
      }
      if (event.key !== 'Tab') return

      // keep focus inside the dialog
      const nodes = sheetRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes?.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      clearTimeout(timerRef.current)
      const restore = restoreRef.current
      if (restore?.isConnected) restore.focus({ preventScroll: true })
    }
  }, [requestClose])

  const urlTransform = makeUrlTransform(repo.name)

  return createPortal(
    <div className="modal">
      <div
        className="modal__overlay"
        data-closing={closing}
        onClick={requestClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        className="modal__sheet surface glass r-xl"
        data-closing={closing}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onPointerMove={setSheen}
      >
        <button
          ref={closeRef}
          type="button"
          className="icon-btn surface gloss modal__close"
          onClick={requestClose}
          aria-label={t.modal.close}
          title={t.modal.close}
        >
          <CloseIcon />
        </button>

        <header className="modal__head">
          <div className="modal__head-main">
            <p className="modal__repo">
              <span className="modal__repo-icon">
                <GitHubIcon />
              </span>
              {repo.fullName}
            </p>

            <h2 className="modal__title" id="modal-title">
              {repo.displayName}
            </h2>

            {repo.description ? <p className="modal__desc">{repo.description}</p> : null}

            <div className="modal__meta">
              {repo.language ? (
                <span className="modal__meta-item">
                  <i
                    className="modal__dot"
                    style={{ background: languageColor(repo.language) }}
                    aria-hidden="true"
                  />
                  {repo.language}
                </span>
              ) : null}
              {repo.stars > 0 ? (
                <span className="modal__meta-item" title={t.portfolio.stars}>
                  <StarIcon />
                  {formatNumber(repo.stars)}
                </span>
              ) : null}
              {repo.forks > 0 ? (
                <span className="modal__meta-item" title={t.portfolio.forks}>
                  <ForkIcon />
                  {formatNumber(repo.forks)}
                </span>
              ) : null}
              <span className="modal__meta-item">
                <ClockIcon />
                {t.portfolio.updated} {formatDate(repo.pushedAt)}
              </span>
            </div>

            {repo.topics.length > 0 ? (
              <div className="modal__topics">
                {repo.topics.map((topic) => (
                  <span className="tag" key={topic}>
                    {topic}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* side rail with the link to the repository itself */}
          <div className="modal__side">
            <a
              className="btn btn--accent modal__github"
              href={repo.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="modal__github-mark">
                <GitHubIcon />
              </span>
              {t.modal.openGithub}
              <span className="modal__github-arrow">
                <ExternalIcon />
              </span>
            </a>

            {repo.homepage ? (
              <a
                className="chip surface gloss interactive modal__homepage"
                href={repo.homepage}
                target="_blank"
                rel="noreferrer noopener"
                onPointerMove={setSheen}
              >
                <span className="chip__icon">
                  <GlobeIcon />
                </span>
                {repo.homepage.replace(/^https?:\/\//, '')}
              </a>
            ) : null}
          </div>
        </header>

        <div className="modal__body">
          <p className="modal__readme-label">
            <span className="modal__readme-icon">
              <BookIcon />
            </span>
            {t.modal.readme}
          </p>

          {readme.status === 'loading' ? (
            <div className="modal__readme-skeleton" aria-label={t.modal.readmeLoading}>
              {['62%', '100%', '88%', '94%', '46%', '100%', '72%'].map((width, i) => (
                <span
                  key={i}
                  className="skeleton"
                  style={{ width, height: i === 0 ? '1.4rem' : '0.85rem' }}
                />
              ))}
            </div>
          ) : null}

          {readme.status === 'empty' ? <p className="modal__note">{t.modal.noReadme}</p> : null}

          {readme.status === 'error' ? (
            <p className="modal__note">{t.modal.readmeError}</p>
          ) : null}

          {readme.status === 'ready' ? (
            <div className="md">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={urlTransform}
                components={markdownComponents}
              >
                {readme.text}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>

        <span className="modal__fade" aria-hidden="true" />
      </div>
    </div>,
    document.body,
  )
}
