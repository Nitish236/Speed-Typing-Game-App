import Link from "next/link";
import "./globals.css";
import Image from "next/image";

import logo from "@/app/icons/game.PNG";
import instagram from "@/app/icons/instagram.png";
import facebook from "@/app/icons/facebook.png";
import twitter from "@/app/icons/twitter.png";
import copyright from "@/app/icons/copyright.png";

export const metadata = {
  title: "Playzala",
  description: "Speed Typing Game to test your typing speed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <ul>
            <li id="home_link">
              <Link href={"/"}>
                <Image width={200} src={logo} alt="Playzala Logo" />
              </Link>
            </li>
          </ul>
        </nav>

        <main>{children}</main>

        <footer>
          <div className="footer">
            <div className="footer_1">
              <Image width={200} height={60} src={logo} alt="Playzala Logo" />
              <div className="social_media_icons">
                <a href="https://instagram.com">
                  <Image
                    width={20}
                    height={20}
                    src={instagram}
                    alt="Instagram Icon"
                  />
                </a>
                <a href="https://facebook.com">
                  <Image
                    width={20}
                    height={20}
                    src={facebook}
                    alt="Facebook Icon"
                  />
                </a>
                <a href="https://twitter.com">
                  <Image
                    width={20}
                    height={20}
                    src={twitter}
                    alt="Twitter Icon"
                  />
                </a>
              </div>
            </div>
            <div className="footer_2">
              <p>
                <Image
                  width={20}
                  height={20}
                  src={copyright}
                  alt="Copyright Icon"
                />{" "}
                <span>{getYear()}</span> <strong>Playzala</strong>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Function to get Current Year

function getYear() {
  let date = new Date();

  let year = date.getFullYear();

  return year;
}
