import { createContext, useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { RequestStateProvider } from './RequestState';
import logo from './assets/logo-blue.png';
import whiteLogo from './assets/logo-white.png';
import whiteWordmark from './assets/wordmark-white.png';
import './astrascend.css';

type Appearance = 'system' | 'light' | 'dark';
const THEME_KEY = 'astrascend-theme';
const ThemeContext = createContext<'light' | 'dark'>('light');
export const useAstrascendTheme = () => useContext(ThemeContext);
const systemDark = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
function savedAppearance(): Appearance {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch { return 'system'; }
}

export function AstrascendLayout() {
  const [appearance, setAppearance] = useState<Appearance>(savedAppearance);
  const [darkSystem, setDarkSystem] = useState(systemDark);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const theme = appearance === 'system' ? darkSystem ? 'dark' : 'light' : appearance;
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setDarkSystem(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView?.({ behavior: 'instant' });
    else window.scrollTo?.({ top: 0 });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'ASTRAscend | ASTRA Developers';
    return () => { document.title = previousTitle; };
  }, []);
  const changeAppearance = (next: Appearance) => {
    setAppearance(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* Appearance still works when storage is unavailable. */ }
  };
  return <ThemeContext.Provider value={theme}><RequestStateProvider>
    <div className="astrascend" data-theme={theme}>
      <a className="as-skip" href="#as-main">Skip to content</a>
      <header className="as-header">
        <div className="as-container as-header-inner">
          <Link to="/astrascend" className="as-brand" aria-label="ASTRAscend home">
            <img src={theme === 'dark' ? whiteLogo : logo} alt="" width="35" height="34" />
            <span>ASTRA Developers</span><small>ASTRAscend</small>
          </Link>
          <button type="button" className="as-menu-button" aria-expanded={menuOpen} aria-controls="as-navigation" onClick={() => setMenuOpen(open => !open)}>Menu {menuOpen ? '−' : '+'}</button>
          <nav id="as-navigation" className={`as-nav${menuOpen ? ' as-nav--open' : ''}`} aria-label="ASTRAscend">
            <Link to="/astrascend#services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/astrascend#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link to="/astrascend#community" onClick={() => setMenuOpen(false)}>Community</Link>
            <Link className="as-button" to="/astrascend/request" onClick={() => setMenuOpen(false)}>Start a request</Link>
          </nav>
          <label className="as-appearance"><span className="as-sr-only">Appearance</span>
            <select aria-label="Appearance" value={appearance} onChange={event => changeAppearance(event.target.value as Appearance)}>
              <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </header>
      <main id="as-main" tabIndex={-1}><Outlet /></main>
      <footer className="as-footer"><div className="as-container as-footer-inner">
        <Link to="/astrascend" className="as-brand"><img className="as-wordmark" src={whiteWordmark} alt="ASTRA Developers" width="226" height="38" /></Link>
        <p>An initiative of ASTRA Developers · AY 2026–2027</p>
        <Link to="/astrascend#community">Community</Link>
      </div></footer>
    </div>
  </RequestStateProvider></ThemeContext.Provider>;
}
