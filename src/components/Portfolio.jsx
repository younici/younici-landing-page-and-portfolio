import { useI18n } from '../i18n/index.jsx'
import ProjectCard from './ProjectCard.jsx'
import { CodeIcon } from './Icons.jsx'
import '../styles/portfolio.css'

function SkeletonCard({ index }) {
  return (
    <div className="project project--skeleton vfade surface glass r-lg" style={{ '--i': index }}>
      <div className="skeleton" style={{ width: '58%', height: '1.25rem' }} />
      <div className="skeleton" style={{ width: '100%', height: '0.8rem' }} />
      <div className="skeleton" style={{ width: '82%', height: '0.8rem' }} />
      <div className="project__meta">
        <div className="skeleton" style={{ width: '4.5rem', height: '0.75rem' }} />
        <div className="skeleton" style={{ width: '5.5rem', height: '0.75rem' }} />
      </div>
    </div>
  )
}

export default function Portfolio({ github, onOpen }) {
  const { t, plural, formatNumber } = useI18n()
  const { status, repos, errorKind, reload } = github

  const message =
    errorKind === 'rate-limit'
      ? t.portfolio.rateLimited
      : errorKind === 'offline'
        ? t.portfolio.offline
        : t.portfolio.error

  return (
    <section className="portfolio" aria-labelledby="portfolio-title">
      <div className="portfolio__head vfade">
        <h2 className="section-title" id="portfolio-title">
          {t.portfolio.title}
        </h2>
        <p className="portfolio__sub">
          <span>{t.portfolio.subtitle}</span>
          {status === 'ready' && repos.length > 0 ? (
            <>
              <span className="portfolio__sep" aria-hidden="true" />
              <span>
                {formatNumber(repos.length)} {plural(repos.length, t.portfolio.counter)}
              </span>
            </>
          ) : null}
        </p>
      </div>

      {status === 'loading' ? (
        <div className="portfolio__grid" aria-busy="true" aria-label={t.portfolio.loading}>
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="notice vfade surface glass r-lg" role="alert">
          <span className="notice__icon">
            <CodeIcon />
          </span>
          <div className="notice__body">
            <p className="notice__title">{t.portfolio.error}</p>
            <p className="notice__text">{message}</p>
          </div>
          <button type="button" className="btn btn--accent" onClick={reload}>
            {t.portfolio.retry}
          </button>
        </div>
      ) : null}

      {status === 'ready' && repos.length === 0 ? (
        <div className="notice vfade surface glass r-lg">
          <span className="notice__icon">
            <CodeIcon />
          </span>
          <div className="notice__body">
            <p className="notice__title">{t.portfolio.empty}</p>
          </div>
        </div>
      ) : null}

      {status === 'ready' && repos.length > 0 ? (
        <div className="portfolio__grid">
          {repos.map((repo, index) => (
            <ProjectCard key={repo.id} repo={repo} index={index} onOpen={onOpen} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
