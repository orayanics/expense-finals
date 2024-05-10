function Contact() {
  return (
    <>
      <div className="contact">
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
        <main className="contact-container">
          <h1 className="contact-headers">We'd Love to Hear From You</h1>
          <p className="contact-text">
            Thank you for your interest in our expense tracking platform. We are
            here to assist you with any questions, feedback, or support you may
            need. Feel free to reach out to us with any questions, concerns, or
            feedback you may have.
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
