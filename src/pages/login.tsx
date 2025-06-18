import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      localStorage.setItem("currentUser", name);
      router.push("/");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>🎈 로그인</h1>
      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          로그인
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        회원이 아니신가요?{" "}
        <a href="/signup" style={{ color: "#0070f3", textDecoration: "underline" }}>
          회원가입
        </a>
      </p>
    </div>
  );
}
