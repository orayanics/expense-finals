function Contact() {
  return (
    <>
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
          <section>
            <h3 className="contact-headers">Connect With Us</h3>
            <p className="contact-text">
              For general inquiries, technical support, or assistance with using
              our platform, please contact our customer support team.
            </p>
            <div className="contact-text">
              <p>
                Social Media: Stay updated and engaged with our latest news,
                offers, and events by following us on social medias.
              </p>
              <p>
                Email: Send us an email at support@exampleexpensewebsite.com,
                and we will respond to your inquiry as soon as possible.
              </p>
            </div>
          </section>
        </main>
      </div>

      <footer className="contact-footer">
        <a href="https://www.facebook.com/site.ust">
          <i class="bi bi-facebook"></i>
        </a>
        <a href="https://www.instagram.com/geloflmno/">
          <i class="bi bi-instagram"></i>
        </a>
        <a href="https://twitter.com/t0hyang">
          <i class="bi bi-twitter"></i>
        </a>
        <a href="https://www.tiktok.com/@bkluxuryph">
          <i class="bi bi-tiktok"></i>
        </a>
      </footer>
    </>
  );
}

export default Contact;
