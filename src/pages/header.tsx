import useAuthStore from "../store/use-user";
import "./header.css";
import SignInButton from "./signin-button";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-left">
          <a href="/" className="logo">
            <span className="logo-icon">💪</span>
            <span className="logo-text">GymPro</span>
          </a>
        </div>

        <div className="header-right">
          {user && (
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>
          )}

          {user ? (
            <div className="user-profile">
              <img
                src="/api/placeholder/32/32"
                alt="User Avatar"
                className="avatar"
              />
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </header>
    </div>
  );
}
