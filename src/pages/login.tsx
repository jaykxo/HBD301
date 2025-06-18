import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: name, user_pw: password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access_token", data.access_token); // JWT 저장
        localStorage.setItem("currentUser", name); // 사용자 이름도 저장
        router.push("/"); // 홈으로 이동
      } else {
        alert(data.error || "로그인에 실패했습니다.");
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>🎈 로그인</h1>
      <form onSubmit={handleSubmit}>
        <label>아이디</label>
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
        <Link href="/signup/" className="btn">회원가입</Link>
      </p>
    </div>
  );
}