const gmailComposeUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=ketulpatel858@gmail.com&su=Portfolio%20Inquiry";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="site-shell">
        <div className="panel footer-inner">
          <p className="footer-note">
            © {new Date().getFullYear()} Ketul Patel. Built for real robots, real projects, and the next role.
          </p>
          <div className="footer-links mono">
            <a href={gmailComposeUrl} target="_blank" rel="noreferrer">
              email
            </a>
            <a href="https://github.com/ketul-Sanjaykumar-Patel" target="_blank" rel="noreferrer">
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
