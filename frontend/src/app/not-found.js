import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="notFound_section">
      <h1>Page not found</h1>
      <p>
        <Link href="/">Home</Link>
      </p>
    </div>
  );
}
