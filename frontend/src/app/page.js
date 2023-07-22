import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <div className="home">
      <section className="practice_section">
        <div>Practice Mode</div>
        <p>
          <Link href="/practice">Enter</Link>
        </p>
      </section>
      <section className="multiplayer_section">
        <div>Multiplayer Mode</div>
        <p>
          <Link href="/multiplayer">Enter</Link>
        </p>
      </section>
    </div>
  );
}
