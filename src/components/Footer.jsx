import { LANGS, LANG_META } from '../i18n/translations.js'
import { useI18n } from '../i18n/index.jsx'
import GlassSegmented from './GlassSegmented.jsx'
import '../styles/footer.css'

export default function Footer() {
  const { t, lang, setLang } = useI18n()

  const options = LANGS.map((code) => ({
    value: code,
    label: LANG_META[code].code,
    ariaLabel: LANG_META[code].label,
  }))

  return (
    <footer className="site-footer">
      <div className="site-footer__bar surface glass r-xl">
        <div className="site-footer__meta">
          <span className="site-footer__name">© {new Date().getFullYear()} {t.landing.name}</span>
          <span className="site-footer__dot" aria-hidden="true" />
          <span className="site-footer__built">{t.footer.builtWith}</span>
        </div>

        <div className="site-footer__lang">
          <span className="site-footer__lang-label">{t.footer.languageLabel}</span>
          <GlassSegmented
            options={options}
            value={lang}
            onChange={setLang}
            size="sm"
            role="radiogroup"
            material="gloss"
            ariaLabel={t.footer.languageAria}
            idPrefix="lang"
            className="seg--inset seg--langs"
          />
        </div>
      </div>
    </footer>
  )
}
