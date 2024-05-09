import { Accordion } from "react-bootstrap";

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
      <main className="how-container">
        <h1>How MoneyDaddy Works</h1>
        <Accordion className="custom-accordion">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Account Setup</Accordion.Header>
            <Accordion.Body>
              Users may need to complete their profile by adding their Google
              account.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion className="custom-accordion">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Categorization</Accordion.Header>
            <Accordion.Body>
              Expenses are typically categorized to help users understand where
              their money is going.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion className="custom-accordion">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Budgeting</Accordion.Header>
            <Accordion.Body>
              Many expense websites offer budgeting tools that allow users to
              set spending limits for different categories.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion className="custom-accordion">
          <Accordion.Item eventKey="3">
            <Accordion.Header>Reporting</Accordion.Header>
            <Accordion.Body>
              Users can generate reports to analyze their spending habits over a
              specific period.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </main>

      <a href="./Login" className="back-to-home">
        <button>Back to Home</button>
      </a>
    </div>
  );
}

export default HowItWorks;
