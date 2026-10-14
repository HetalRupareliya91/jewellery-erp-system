import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

/*
 * Every file in ./pages exports `meta = { path, title, group, order }` and a default component.
 * Pages are discovered at build time, so adding a screen needs no change here.
 */
const modules = import.meta.glob('./pages/*.jsx', { eager: true });
const pages = Object.values(modules)
  .filter((m) => m.meta && m.default)
  .map((m) => ({ meta: m.meta, Component: m.default }));

export default function App() {
  const home = pages.find((p) => p.meta.path === '/');
  return (
    <Layout pages={pages}>
      <Routes>
        {pages.map(({ meta, Component }) => (
          <Route key={meta.path} path={meta.path} element={<Component />} />
        ))}
        {!home && pages[0] && <Route path="/" element={<Navigate to={pages[0].meta.path} replace />} />}
        {pages.length === 0 && <Route path="/" element={<p>No screens yet.</p>} />}
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </Layout>
  );
}
