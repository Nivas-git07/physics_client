import React, { useEffect } from 'react';
import axios from 'axios';
import './Google.css';

function GoogleLoginButton() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "781585090183-gnvadv2uqurqn2414kdlj995m8604u97.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: 300,
          text: "signin_with",
          shape: "rectangular",
        }
      );

      window.google.accounts.id.prompt(); // optionally show one-tap
    };

    // optional cleanup if you want
    return () => {
      // Remove script if needed
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    try {
      const res = await axios.post("http://localhost:5000/api/google", {
        token: response.credential,
      });
      console.log("Server response:", res.data);
      alert("Google login successful!");
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Google login failed!");
    }
  };

  return (
    <div className="google-wrapper">
      <div id="googleSignInDiv" className="google-button-container"></div>
    </div>
  );
}

export default GoogleLoginButton;
