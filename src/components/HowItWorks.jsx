import "../styles/routes.css";

function HowItWorks() {
  return (
    <div className="how-it-works">
      <div className="topnav">
        <b className="navbar-brand" href="/">
          <div className="logo-image">
            <a href="/">
              <img src="imagee#" alt="MoneyDaddy" width="180" />
            </a>
          </div>
        </b>
        <a href="/how"> HOW IT WORKS</a>
        <a href="/faqs"> FAQS </a>
        <a href="/contact"> CONTACT </a>
      </div>
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
