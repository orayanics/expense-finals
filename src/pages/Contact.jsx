import GeneralNav from "../components/GeneralNav";
import Footer from "../components/Footer";
import "../styles/contact.css";

function Contact() {
  return (
    <div className="contact">
      <GeneralNav />

      <main className="contact-container">
        <div>
          <h2 className="contact-headers">Contact With Us</h2>
          <p className="contact-text">
            Thank you for your interest in our expense tracking platform. We are
            here to assist you with any questions, feedback, or support you may
            need.
          </p>

          <p className="contact-text">
            Social Media: Stay updated and engaged with our latest news, offers,
            and events by following us on social media.
          </p>
          <p className="contact-text">
            Email: Send us an email at support@exampleexpensewebsite.com, and we
            will respond to your inquiry as soon as possible.
          </p>
        </div>

        <div>
          <h2 className="contact-headers">Customer Support</h2>
          <p className="contact-text">
            For general inquiries, technical support, or assistance with using
            our platform, please contact our customer support team.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
