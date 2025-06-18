import { useRouter } from "next/router";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: id,
          user_pw: password,
          user_nickname: nickname,
          birth: birthday,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error ?? "회원가입 실패");
        return;
      }

      router.push("/login");
    } catch (_) {
      setError("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>🎉 회원가입</h1>

      <form onSubmit={handleSubmit}>
        <label>아이디</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>이름</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <label>생일</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: 16 }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button type="submit" style={{ width: "100%" }}>
          회원가입
        </button>
      </form>
    </div>
  );
}