import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { LANGS, LANG_META, translations } from './translations.js'

const STORAGE_KEY = 'younici.lang'
const FALLBACK = 'en'

/**
 * Saved choice wins, then the browser languages, then English.
 */
export function detectLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGS.includes(saved)) return saved
  } catch {
    /* private mode / storage disabled — fall through to auto detection */
  }

  const nav = typeof navigator === 'undefined' ? null : navigator
  const candidates = nav
    ? [...(nav.languages?.length ? nav.languages : []), nav.language].filter(Boolean)
    : []

  for (const raw of candidates) {
    const tag = String(raw).toLowerCase()
    if (tag.startsWith('uk') || tag.startsWith('ua')) return 'ua'
    if (tag.startsWith('ru')) return 'ru'
    if (tag.startsWith('en')) return 'en'
  }
  return FALLBACK
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLang)

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* not fatal — the language just won't persist */
    }
  }, [])

  const meta = LANG_META[lang] ?? LANG_META[FALLBACK]

  useEffect(() => {
    document.documentElement.lang = meta.htmlLang
    document.title = translations[lang].docTitle
  }, [lang, meta.htmlLang])

  const value = useMemo(() => {
    const locale = meta.locale

    /** Picks the right plural form: [one, few, many] (many doubles as "other"). */
    const plural = (count, forms) => {
      if (!Array.isArray(forms)) return forms
      let category = 'other'
      try {
        category = new Intl.PluralRules(locale).select(count)
      } catch {
        category = count === 1 ? 'one' : 'other'
      }
      const index = { one: 0, few: 1, many: 2, two: 1, other: 2, zero: 2 }[category] ?? 2
      return forms[index] ?? forms[forms.length - 1]
    }

    const formatDate = (input, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
      const date = input instanceof Date ? input : new Date(input)
      if (Number.isNaN(date.getTime())) return ''
      try {
        return new Intl.DateTimeFormat(locale, options).format(date)
      } catch {
        return date.toISOString().slice(0, 10)
      }
    }

    return {
      lang,
      setLang,
      locale,
      meta,
      t: translations[lang],
      plural,
      /** "17 years" / "17 лет" / "17 років" */
      countLabel: (count, forms) => `${count} ${plural(count, forms)}`,
      formatDate,
      formatMonthYear: (input) => formatDate(input, { month: 'long', year: 'numeric' }),
      formatNumber: (n) => {
        try {
          return new Intl.NumberFormat(locale).format(n)
        } catch {
          return String(n)
        }
      },
    }
  }, [lang, meta, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
