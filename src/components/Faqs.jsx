import { Accordion } from "react-bootstrap";
import GeneralNav from "./GeneralNav";
import Footer from "./Footer";
import "../styles/faq.css";

function Faqs() {
  return (
    <div className="faqs">
      <div className="faq-container">
        <GeneralNav />
        <div className="faq-accordion">
          <h1>Frequently Asked Questions</h1>
          <Accordion className="custom-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                What is an expense tracking website, and why should I use one?
              </Accordion.Header>
              <Accordion.Body>
                An expense-tracking website helps you monitor and manage your
                spending by categorizing expenses, setting budgets, and
                generating reports.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className="custom-accordion">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Is my financial information safe on this website?
              </Accordion.Header>
              <Accordion.Body>
                Yes, we take the security of your financial information
                seriously. We use encryption protocols, secure data storage, and
                other measures to protect your data from unauthorized access.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className="custom-accordion">
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                Can I sync my bank accounts and credit cards with this website?
              </Accordion.Header>
              <Accordion.Body>
                Yes, you can connect your bank accounts and credit cards to
                automatically import transaction data.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className="custom-accordion">
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                Can I create custom categories for my expenses?
              </Accordion.Header>
              <Accordion.Body>
                Yes, you can create custom categories to suit your specific
                needs.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className="custom-accordion">
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                How does budgeting work on this website?
              </Accordion.Header>
              <Accordion.Body>
                You can set spending limits for different categories and receive
                notifications when you're approaching or exceeding your budget.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <a href="/" className="back-to-home">
          <button>Back to Home</button>
        </a>
        <Footer />
      </div>
    </div>
  );
}

export default Faqs;
