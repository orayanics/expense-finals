import "../styles/routes.css";

function HowItWorks() {
  return (
    <div className="how-it-works">
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
      <h2>How MoneyDaddy Works</h2>
      <ol>
        <li>
          Account Setup - Users may need to complete their profile by adding
          their Google account.
        </li>
        <li>
          Expense Tracking - The website's core functionality often focuses on
          tracking expenses.
        </li>
        <li>
          Categorization - Expenses are typically categorized to help users
          understand where their money is going.
        </li>
        <li>
          Budgeting - Many expense websites offer budgeting tools that allow
          users to set spending limits for different categories.
        </li>
        <li>
          Reporting - Users can generate reports to analyze their spending
          habits over a specific period.
        </li>
      </ol>
      <a href="./Login" className="back-to-home">
        Back to Home
      </a>
    </div>
  );
}

export default HowItWorks;
