import '../styles/generalnav.css';
export default function GeneralNav() {
  return (
    <div className="topnav">
      <b className="navbar-brand">
        <div className="logo-image">
          <a href="/" className="moneydaddy-link">
            <img src="MONEYDADDY.png" alt="MoneyDaddy" width="25" />
            <span className="moneydaddy-text">MoneyDaddy</span>
          </a>
        </div>
      </b>
      <a href="/how"> HOW IT WORKS</a>
      <a href="/faqs"> FAQS </a>
      <a href="/contact"> CONTACT </a>
    </div>
  );
}
