import { languageColor } from '../hooks/useGitHub.js'
import { useI18n } from '../i18n/index.jsx'
import { setSheen } from '../hooks/useUi.js'
import { ClockIcon, ExternalIcon, StarIcon } from './Icons.jsx'

/**
 * Card is a real <article> (so the title stays a heading) with one stretched
 * button on top of it as the hit area.
 */
export default function ProjectCard({ repo, index, onOpen }) {
  const { t, formatDate, formatNumber } = useI18n()

  return (
    <article
      className="project vfade surface glass r-lg interactive"
      style={{ '--i': index }}
      onPointerMove={setSheen}
    >
      <div className="project__head">
        <h3 className="project__title">{repo.displayName}</h3>
        <span className="project__arrow" aria-hidden="true">
          <ExternalIcon />
        </span>
      </div>

      {repo.description ? (
        <p className="project__desc">{repo.description}</p>
      ) : (
        <p className="project__desc project__desc--empty">{t.portfolio.noDescription}</p>
      )}

      {repo.topics.length > 0 ? (
        <div className="project__topics">
          {repo.topics.slice(0, 3).map((topic) => (
            <span className="tag" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      ) : null}

      <div className="project__meta">
        {repo.language ? (
          <span className="project__lang">
            <i style={{ background: languageColor(repo.language) }} aria-hidden="true" />
            {repo.language}
          </span>
        ) : null}

        {repo.stars > 0 ? (
          <span className="project__stat" title={t.portfolio.stars}>
            <StarIcon />
            {formatNumber(repo.stars)}
          </span>
        ) : null}

        <span className="project__stat project__updated">
          <ClockIcon />
          {formatDate(repo.pushedAt)}
        </span>
      </div>

      <button
        type="button"
        className="project__hit"
        onClick={() => onOpen(repo)}
        aria-label={`${repo.displayName} — ${t.portfolio.openCard}`}
      />
    </article>
  )
}
