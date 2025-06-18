import { ReactNode } from "react";
import LogoutButton from "./LogoutButton";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h2>🎂 생일 편지 게시판</h2>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}
