import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ 加这行
import { auth } from "../firebase";

function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ 创建跳转函数

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      }
      navigate("/"); // ✅ 成功后跳转主页
    } catch (error) {
      alert(error.message);
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "80px auto",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "10px 15px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    toggleText: {
      marginTop: "15px",
      textAlign: "center",
      fontSize: "14px",
    },
    toggleLink: {
      color: "#007BFF",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{isRegister ? "Register" : "Login"}</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>
          {isRegister ? "Create Account" : "Login"}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isRegister ? (
          <>
            Already have an account?{" "}
            <span style={styles.toggleLink} onClick={() => setIsRegister(false)}>
              Login
            </span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span style={styles.toggleLink} onClick={() => setIsRegister(true)}>
              Register
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default AuthForm;
