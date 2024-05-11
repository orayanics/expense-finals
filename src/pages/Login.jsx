import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

// Toast
import { successAlert, errorAlert } from "../utils/toastAlert";
import GeneralNav from "./../components/GeneralNav";
import Footer from "./../components/Footer";
export default function Login() {
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const authInfo = {
        userId: res.user.uid,
        email: res.user.email,
        name: res.user.displayName,
        photo: res.user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
      successAlert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      errorAlert("There seems to be a problem. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <GeneralNav />

        <div>
          <div className="moving">
            <img src="COINS.png" alt="coin" class="coin-img" />
          </div>
          <div className="d-flex align-content-center justify-content-center">
            <div className="align-self-center d-flex flex-column ">
              <h1 className="text1">
                Control Your Cash
                <span>
                  <strong>Shape Your Future</strong>
                </span>
              </h1>
              <button className="signin" onClick={signIn}>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
