import { useAuth } from "../contexts/AuthContext";

export default function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) return null;

  return (
    <button onClick={logout} style={{ marginLeft: "auto" }}>
      로그아웃
    </button>
  );
}