import multi from "@/app/styles/multiplayer.module.css";
import Link from "next/link";
import { io } from "socket.io-client";

export default function Multiplayer() {
  return (
    <div className={multi.page}>
      <section className={multi.create}>
        <div>Create a Room</div>
        <p>
          <Link href="/multiplayer/lobby">Enter</Link>
        </p>
      </section>
      <section className={multi.join}>
        <div>Join a Room</div>
        <p>
          <Link href="/multiplayer/game">Enter</Link>
        </p>
      </section>
    </div>
  );
}
