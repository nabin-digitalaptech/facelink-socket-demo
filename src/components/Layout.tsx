import { Outlet, Link } from "react-router-dom";
const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Web Socket</Link>
          </li>
          <li>
            <Link to="/request-login">Request Login</Link>
          </li>
          <li>
            <Link to="/message">Message Test</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
};
export default Layout;
