import { Accordion } from "react-bootstrap";
import GeneralNav from "../components/GeneralNav";
import Footer from "../components/Footer";
import "../styles/how.css";

function HowItWorks() {
  return (
    <div className="how">
      <div className="how-container">
        <GeneralNav />
        <main className="how-accordion">
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
                Expenses are typically categorized to help users understand
                where their money is going.
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
                Users can generate reports to analyze their spending habits over
                a specific period.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </main>

        <a href="./Login" className="back-to-home">
          <button>Back to Home</button>
        </a>
        <Footer />
      </div>
    </div>
  );
}

export default HowItWorks;
