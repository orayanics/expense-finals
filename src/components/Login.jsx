import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
    <div className="container-fluid d-flex align-content-center justify-content-center min-vh-100">
      <div className="align-self-center d-flex align-content-center flex-column bg-dark-subtle p-5">
        <h3>Google OAuth</h3>
        <button onClick={signIn}>Sigh in with Google</button>
      </div>
    </div>
  );
}
