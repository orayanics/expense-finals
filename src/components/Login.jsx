import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/routes.css"; 

export default function Login() {
  const navigate = useNavigate();

  const signIn = async () => {
    const res = await signInWithPopup(auth, provider);
    const authInfo = {
      userId: res.user.uid,
      email: res.user.email,
      name: res.user.displayName,
      photo: res.user.photoURL,
      isAuth: true,
    };
    console.log(authInfo.userId);
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/dashboard");
  };

  return (
   <div>
    <div className= "topnav">
      <b className ="navbar-brand" href="/">
          <div className = "logo-image">
              <a href = "homepage.php"> 
              <img src = "imagee#" alt = "MoneyDaddy" width = "180"/>
              </a>
          </div>
      </b>
      <a href = "#"> HOW IT WORKS</a>
      <a href = "#"> FAQS </a>
      <a href = "#"> CONTACT </a>
    </div>   
      <div id="moving">
        <div className="d-flex align-content-center justify-content-center min-vh-100">
          <div className="align-self-center d-flex flex-column ">
            <h1 className="text1">Control Your Cash</h1>
            <h1 className="text2">Shape Your Future</h1>
            <button className="signin" onClick={signIn}>Sign in with Google</button>
          </div>
        </div>
      </div>
   </div>

  );
}
  


  
  


