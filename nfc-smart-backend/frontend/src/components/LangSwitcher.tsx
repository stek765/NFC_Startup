import { langs, useLang } from '../i18n';

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center">
      {langs.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
            lang === code ? 'text-accent' : 'text-text-muted/70'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
