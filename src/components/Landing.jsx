import { useMemo } from 'react'

import { getAge, profile } from '../config/profile.js'
import { useI18n } from '../i18n/index.jsx'
import { setSheen, useFlag } from '../hooks/useUi.js'
import { ArrowDownIcon, CheckIcon, CopyIcon, Icon, MailIcon } from './Icons.jsx'
import '../styles/landing.css'

const PLATFORM_NAMES = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  telegram: 'Telegram',
}

export default function Landing({ github, onViewChange }) {
  const { t, plural, formatMonthYear, formatNumber } = useI18n()
  const [copied, flagCopied] = useFlag()

  // const age = useMemo(() => getAge(profile.birthDate), [])
  const user = github.user
  const repoCount = github.repos.length || user?.publicRepos || 0
  const joined = user?.createdAt ? new Date(user.createdAt) : null

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      flagCopied()
    } catch {
      window.prompt(t.landing.emailLabel, profile.email)
    }
  }

  const initials = t.landing.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <section
      className="landing vfade surface glass r-xl interactive"
      onPointerMove={setSheen}
      aria-labelledby="landing-name"
    >
      <span className="landing__orb" aria-hidden="true" />

      <div className="landing__top">
        <div className="landing__avatar surface gloss r-pill">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" width="120" height="120" />
          ) : (
            <span className="landing__initials">{initials}</span>
          )}
          <span className="landing__avatar-ring" aria-hidden="true" />
        </div>

        <div className="landing__intro">
          <p className="eyebrow landing__eyebrow">{t.landing.eyebrow}</p>
          <h1 className="landing__name" id="landing-name">
            {t.landing.name}
          </h1>
          <p className="landing__role">
            <span className="landing__role-dot" aria-hidden="true" />
            {t.landing.role}
            {user?.login ? <span className="landing__handle">@{user.login}</span> : null}
          </p>
        </div>
      </div>

      <p className="landing__tagline">{t.landing.tagline}</p>

      <div className="landing__stats">
        {/* TEMPORARILY HIDDEN: age
        <div className="stat surface gloss r-lg">
          <span className="stat__label">{t.landing.ageLabel}</span>
          <span className="stat__value">
            {age}
            <span className="stat__unit">{plural(age, t.landing.years)}</span>
          </span>
        </div>
        */}

        <div className="stat surface gloss r-lg">
          <span className="stat__label">{t.landing.reposLabel}</span>
          <span className="stat__value">
            {github.status === 'loading' ? <span className="skeleton stat__skeleton" /> : formatNumber(repoCount)}
          </span>
        </div>

        <div className="stat surface gloss r-lg">
          <span className="stat__label">{t.landing.sinceLabel}</span>
          <span className="stat__value">
            {joined ? (
              joined.getFullYear()
            ) : github.status === 'loading' ? (
              <span className="skeleton stat__skeleton" />
            ) : (
              '—'
            )}
          </span>
          {joined ? <span className="stat__caption">{formatMonthYear(joined)}</span> : null}
        </div>
      </div>

      <div className="landing__contact">
        <a
          className="chip surface gloss interactive landing__email"
          href={`mailto:${profile.email}`}
          onPointerMove={setSheen}
        >
          <span className="chip__icon">
            <MailIcon />
          </span>
          <span className="landing__email-text">
            <span className="landing__email-label">{t.landing.emailLabel}</span>
            <span className="landing__email-value">{profile.email}</span>
          </span>
        </a>

        <button
          type="button"
          className="icon-btn surface gloss interactive landing__copy"
          onClick={copyEmail}
          aria-label={copied ? t.landing.copied : t.landing.copy}
          title={copied ? t.landing.copied : t.landing.copy}
          data-copied={copied}
        >
          <span className="landing__copy-icon">{copied ? <CheckIcon /> : <CopyIcon />}</span>
        </button>

        <button
          type="button"
          className="btn btn--accent landing__cta"
          onClick={() => onViewChange('portfolio')}
        >
          {t.landing.scrollHint}
          <span className="landing__cta-icon">
            <ArrowDownIcon />
          </span>
        </button>
      </div>

      <div className="landing__socials">
        <p className="eyebrow">{t.landing.socialsLabel}</p>
        <div className="landing__social-grid">
          {profile.links.map((link) => (
            <a
              key={link.id}
              className="social surface gloss r-md interactive lift"
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              onPointerMove={setSheen}
            >
              <span className="social__icon">
                <Icon name={link.id} />
              </span>
              <span className="social__text">
                <span className="social__name">{PLATFORM_NAMES[link.id] ?? link.id}</span>
                <span className="social__handle">{link.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
