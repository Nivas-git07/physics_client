import React, { useEffect } from "react";
import axios from "axios";

function App() {
  // 📌 Load Google script and initialize login
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "781585090183-gnvadv2uqurqn2414kdlj995m8604u97.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );

      window.google.accounts.id.prompt(); // Optional: show one-tap popup
    };
  }, []);

  // 📌 Handle Google credential response
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

  // ✅ Render
  return (
    <div style={{ margin: "50px" }}>
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login with Google</h2>
        <div id="googleSignInDiv"></div>
      </div>
    </div>
  );
}

export default App;
