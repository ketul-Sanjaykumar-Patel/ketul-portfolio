export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="site-shell">
        <div className="panel footer-inner">
          <p className="footer-note">
            © {new Date().getFullYear()} Ketul Patel. Built for real robots, real projects, and the next role.
          </p>
          <div className="footer-links mono">
            <a href="mailto:ketulpatel858@gmail.com">email</a>
            <a href="https://github.com/ketul099" target="_blank" rel="noreferrer">
              github
            </a>
            <a href="https://www.linkedin.com/in/ketul-patel-kp099/" target="_blank" rel="noreferrer">
              linkedin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
