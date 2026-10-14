import { NavLink } from 'react-router-dom';

const GROUP_ORDER = ['Overview', 'Inventory', 'Production', 'Sales & Purchase', 'Accounting', 'Reports'];

// Sidebar grouped by each page's meta.group
export default function Layout({ pages, children }) {
  const groups = GROUP_ORDER.map((g) => ({
    name: g,
    pages: pages.filter((p) => p.meta.group === g).sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0)),
  })).filter((g) => g.pages.length);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">◆ Jewellery ERP</div>
        {groups.map((g) => (
          <nav className="nav-group" key={g.name}>
            <h4>{g.name}</h4>
            {g.pages.map((p) => (
              <NavLink key={p.meta.path} to={p.meta.path} end>
                {p.meta.title}
              </NavLink>
            ))}
          </nav>
        ))}
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
