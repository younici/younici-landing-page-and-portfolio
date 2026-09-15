import { useCallback, useEffect, useRef, useState } from 'react'

import { profile } from '../config/profile.js'

const OWNER = profile.github
const API = 'https://api.github.com'
const CACHE_PREFIX = 'younici.gh.'
const CACHE_TTL = 30 * 60 * 1000 // 30 min — keeps the 60 req/h anonymous limit happy

/* ------------------------------------------------------------------ cache */

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    if (!at || Date.now() - at > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage full or unavailable — caching is a bonus, not a requirement */
  }
}

/* ------------------------------------------------------------------ fetch */

async function ghFetch(path, signal) {
  const res = await fetch(API + path, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (res.ok) return res.json()

  const error = new Error(`GitHub responded ${res.status}`)
  error.status = res.status
  if (res.status === 404) {
    error.kind = 'not-found'
  } else if (
    (res.status === 403 || res.status === 429) &&
    res.headers.get('x-ratelimit-remaining') === '0'
  ) {
    error.kind = 'rate-limit'
  } else {
    error.kind = 'http'
  }
  throw error
}

function classify(err) {
  if (err?.kind) return err.kind
  return 'offline' // TypeError from fetch — DNS, offline, blocked
}

/** Base64 (with newlines) → UTF-8 string, so Cyrillic READMEs survive. */
function decodeBase64Utf8(base64) {
  const binary = atob(String(base64).replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

/* ---------------------------------------------------------------- shaping */

/** `-ASCII-` → `ASCII`, `Quote-Bot` → `Quote Bot`, `MineManager` unchanged. */
function prettifyName(name) {
  const pretty = name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return pretty || name
}

function shapeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    displayName: prettifyName(repo.name),
    fullName: repo.full_name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 6) : [],
    url: repo.html_url,
    homepage: repo.homepage || null,
    defaultBranch: repo.default_branch || 'HEAD',
    archived: Boolean(repo.archived),
    pushedAt: repo.pushed_at || repo.updated_at,
    createdAt: repo.created_at,
  }
}

function prepareRepos(list) {
  const hidden = new Set(profile.hiddenRepos.map((n) => n.toLowerCase()))
  const pinned = profile.pinnedRepos.map((n) => n.toLowerCase())
  const rank = (name) => {
    const i = pinned.indexOf(name.toLowerCase())
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }

  return list
    .filter((repo) => !repo.fork && !repo.private && !hidden.has(repo.name.toLowerCase()))
    .map(shapeRepo)
    .sort((a, b) => {
      const byPin = rank(a.name) - rank(b.name)
      if (byPin !== 0) return byPin
      return new Date(b.pushedAt) - new Date(a.pushedAt)
    })
}

/* ------------------------------------------------------------------ hooks */

/** Owner profile + repository grid, cached per session. */
export function useGitHub() {
  const [state, setState] = useState(() => {
    const cached = readCache('bundle')
    return cached
      ? { status: 'ready', user: cached.user, repos: cached.repos, errorKind: null }
      : { status: 'loading', user: null, repos: [], errorKind: null }
  })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const cached = nonce === 0 ? readCache('bundle') : null
    if (cached) {
      setState({ status: 'ready', user: cached.user, repos: cached.repos, errorKind: null })
      return
    }

    const controller = new AbortController()
    let alive = true

    setState((prev) => ({ ...prev, status: 'loading', errorKind: null }))
    ;(async () => {
      try {
        const [user, repos] = await Promise.all([
          ghFetch(`/users/${OWNER}`, controller.signal),
          ghFetch(`/users/${OWNER}/repos?per_page=100&sort=pushed`, controller.signal),
        ])
        if (!alive) return
        const bundle = {
          user: {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            publicRepos: user.public_repos ?? 0,
            createdAt: user.created_at,
            url: user.html_url,
          },
          repos: prepareRepos(repos),
        }
        writeCache('bundle', bundle)
        setState({ status: 'ready', ...bundle, errorKind: null })
      } catch (err) {
        if (!alive || err?.name === 'AbortError') return
        setState({ status: 'error', user: null, repos: [], errorKind: classify(err) })
      }
    })()

    return () => {
      alive = false
      controller.abort()
    }
  }, [nonce])

  const reload = useCallback(() => {
    try {
      sessionStorage.removeItem(CACHE_PREFIX + 'bundle')
    } catch {
      /* ignore */
    }
    setNonce((n) => n + 1)
  }, [])

  return { ...state, reload }
}

/** README markdown for one repo, fetched the first time it is opened. */
export function useReadme(repo) {
  const name = repo?.name ?? null
  const [state, setState] = useState({ status: 'idle', text: '', errorKind: null })
  const requested = useRef(null)

  useEffect(() => {
    if (!name) {
      setState({ status: 'idle', text: '', errorKind: null })
      return
    }

    const cached = readCache(`readme.${name}`)
    if (cached !== null) {
      setState(
        cached === ''
          ? { status: 'empty', text: '', errorKind: null }
          : { status: 'ready', text: cached, errorKind: null },
      )
      return
    }

    const controller = new AbortController()
    let alive = true
    requested.current = name
    setState({ status: 'loading', text: '', errorKind: null })
    ;(async () => {
      try {
        const data = await ghFetch(`/repos/${OWNER}/${name}/readme`, controller.signal)
        if (!alive) return
        const text = data.encoding === 'base64' ? decodeBase64Utf8(data.content) : data.content || ''
        const trimmed = text.trim()
        writeCache(`readme.${name}`, trimmed)
        setState(
          trimmed
            ? { status: 'ready', text: trimmed, errorKind: null }
            : { status: 'empty', text: '', errorKind: null },
        )
      } catch (err) {
        if (!alive || err?.name === 'AbortError') return
        const kind = classify(err)
        if (kind === 'not-found') {
          writeCache(`readme.${name}`, '')
          setState({ status: 'empty', text: '', errorKind: null })
        } else {
          setState({ status: 'error', text: '', errorKind: kind })
        }
      }
    })()

    return () => {
      alive = false
      controller.abort()
    }
  }, [name])

  return state
}

/** Safe-ish URL resolver for README links and images. */
export function makeUrlTransform(repoName) {
  return (url, key) => {
    if (!url) return ''
    const value = String(url).trim()
    if (/^(javascript|vbscript|file):/i.test(value)) return ''
    if (/^data:/i.test(value)) return key === 'src' && /^data:image\//i.test(value) ? value : ''
    if (/^#/.test(value)) return value
    if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')) return value

    const clean = value.replace(/^\.?\//, '')
    return key === 'src'
      ? `https://raw.githubusercontent.com/${OWNER}/${repoName}/HEAD/${clean}`
      : `https://github.com/${OWNER}/${repoName}/blob/HEAD/${clean}`
  }
}

export const LANGUAGE_COLORS = {
  Python: '#3f7fd1',
  JavaScript: '#e8c54a',
  TypeScript: '#4a7fd1',
  'C#': '#8f68d4',
  C: '#8d9aa8',
  'C++': '#e05a7a',
  HTML: '#e06a3e',
  CSS: '#6a58d4',
  SCSS: '#d4628f',
  Java: '#c4763a',
  Kotlin: '#a97bf0',
  Go: '#4ec2dc',
  Rust: '#d38a5a',
  Shell: '#7ec36a',
  Lua: '#4a5fd1',
  Dart: '#38b0c4',
  PHP: '#7a85c4',
  Ruby: '#d0434a',
  Swift: '#f05138',
  Dockerfile: '#4a8fd1',
  Vue: '#43ba8a',
  Jupyter: '#d9873a',
}

export function languageColor(language) {
  return LANGUAGE_COLORS[language] || '#9fb2c9'
}
