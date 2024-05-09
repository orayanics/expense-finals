import "../styles/routes.css";
import { Accordion } from "react-bootstrap";

function Faqs() {
  return (
    <div className="faqs">
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
      <main className="App-main">
        <section className="App-faq">
          <h2>Frequently Asked Questions</h2>
          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                1. What is an expense tracking website, and why should I use
                one?
              </Accordion.Header>
              <Accordion.Body>
                An expense-tracking website helps you monitor and manage your
                spending by categorizing expenses, setting budgets, and
                generating reports.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                2. Is my financial information safe on this website?
              </Accordion.Header>
              <Accordion.Body>
                Yes, we take the security of your financial information
                seriously. We use encryption protocols, secure data storage, and
                other measures to protect your data from unauthorized access.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                3. Can I sync my bank accounts and credit cards with this
                website?
              </Accordion.Header>
              <Accordion.Body>
                Yes, you can connect your bank accounts and credit cards to
                automatically import transaction data.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                4. Can I create custom categories for my expenses?
              </Accordion.Header>
              <Accordion.Body>
                Yes, you can create custom categories to suit your specific
                needs.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                5. How does budgeting work on this website?
              </Accordion.Header>
              <Accordion.Body>
                You can set spending limits for different categories and receive
                notifications when you're approaching or exceeding your budget.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </section>
      </main>
      <a href="./Login" className="back-to-home">
        Back to Home
      </a>
    </div>
  );
}

export default Faqs;
