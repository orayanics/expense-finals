import "../styles/routes.css";

function Faqs() {
  return (
    <div className="faqs">
      <header className="App-header">
        <img src="logo.png" alt="MoneyDaddy" className="App-logo" />
        <h1 className="App-title">MoneyDaddy</h1>
        <nav className="App-nav">
          <ul>
            <li>
              <a href="./how-it-works">HOW IT WORKS</a>
            </li>
            <li>
              <a href="./faqs">FAQS</a>
            </li>
            <li>
              <a href="./contact">CONTACT</a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="App-main">
        <section className="App-faq">
          <h2>Frequently Asked Questions</h2>
          <article>
            <h3>
              1. What is an expense tracking website, and why should I use one?
            </h3>
            <p>
              An expense-tracking website helps you monitor and manage your
              spending by categorizing expenses, setting budgets, and generating
              reports.
            </p>
          </article>
          <article>
            <h3>2. Is my financial information safe on this website?</h3>
            <p>
              Yes, we take the security of your financial information seriously.
              We use encryption protocols, secure data storage, and other
              measures to protect your data from unauthorized access.
            </p>
          </article>
          <article>
            <h3>
              3. Can I sync my bank accounts and credit cards with this website?
            </h3>
            <p>
              Yes, you can connect your bank accounts and credit cards to
              automatically import transaction data.
            </p>
          </article>
          <article>
            <h3>4. Can I create custom categories for my expenses?</h3>
            <p>
              Yes, you can create custom categories to suit your specific needs.
            </p>
          </article>
          <article>
            <h3>5. How does budgeting work on this website?</h3>
            <p>
              You can set spending limits for different categories and receive
              notifications when you're approaching or exceeding your budget.
            </p>
          </article>
        </section>
      </main>
      <a href="./Login" className="back-to-home">
        Back to Home
      </a>
    </div>
  );
}

export default Faqs;
