import GeneralNav from '../components/GeneralNav';
import Footer from '../components/Footer';
import '../styles/error.css'

export default function NotFound() {
  return (
    <div className='error-container'>
      <GeneralNav />
      <div>
        <h1>404</h1>
        <h2>Oops. Where's your money?</h2>
        <p>Looks like the page you're trying to access is unavailabe.</p>
        <a href={`/`}>
          <button className="go-back">Go Back</button>
        </a>
      </div>
      <Footer />
    </div>
  );
}
