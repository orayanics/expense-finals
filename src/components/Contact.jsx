function Contact() {
  return (
    <div className="contact">
      <div className="topnav">
        <b className="navbar-brand" href="/">
          <div className="logo-image">
            <a href="/" class="moneydaddy-link">
              <img src="MONEYDADDY.png" alt="MoneyDaddy" width="25" />
              <span class="moneydaddy-text">MoneyDaddy</span>
            </a>
          </div>
        </b>
        <a href="/how"> HOW IT WORKS</a>
        <a href="/faqs"> FAQS </a>
        <a href="/contact"> CONTACT </a>
      </div>
      <main className="contact-container">
        <h2>Contact us</h2>
        <p>
          Thank you for your interest in our expense tracking platform. We are
          here to assist you with any questions, feedback, or support you may
          need. Please choose a contact option that works best for you:
        </p>
        <section>
          <h3>Customer Support</h3>
          <p>
            For general inquiries, technical support, or assistance with using
            our platform, please contact our customer support team.
          </p>
          <ul>
            <li>
              Live Chat: Click the chat icon in the bottom right corner of your
              screen to chat with a support representative in real-time during
              our business hours.
            </li>
            <li>
              Email: Send us an email at support@exampleexpensewebsite.com, and
              we will respond to your inquiry as soon as possible.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Contact;