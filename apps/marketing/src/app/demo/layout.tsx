import { DemoThemeProvider } from './DemoThemeProvider'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  // Prevent light-flash on navigation/reload by applying theme class BEFORE paint.
  // This runs before React hydration.
  const themeScript = `
    (function () {
      try {
        var key = 'slydes-demo-theme';
        var stored = localStorage.getItem(key);
        var isDark = stored === 'dark';
        if (stored !== 'dark' && stored !== 'light') {
          isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        var root = document.documentElement;
        if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
        root.style.colorScheme = isDark ? 'dark' : 'light';
      } catch (e) {}
    })();
  `

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <DemoThemeProvider>{children}</DemoThemeProvider>
    </>
  )
}


