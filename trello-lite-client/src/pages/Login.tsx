import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/boards");
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Login failed");
    }
  };

  return (
    <div style={{maxWidth:360, margin:"40px auto", padding:16}}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{display:"block", width:"100%", margin:"8px 0"}} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{display:"block", width:"100%", margin:"8px 0"}} />
        {err && <p style={{color:"red"}}>{err}</p>}
        <button>Sign in</button>
      </form>
    </div>
  );
}
