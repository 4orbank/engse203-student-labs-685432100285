import { NavLink } from 'react-router-dom';

function AppHeader() {
  const navClassName = ({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 05</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav aria-label="เมนูหลัก">
          <NavLink className={navClassName} to="/" end>Dashboard</NavLink>
          <NavLink className={navClassName} to="/requests/new">New Request</NavLink>
          <NavLink className={navClassName} to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
