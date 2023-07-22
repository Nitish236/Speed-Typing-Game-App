import css from "@/app/styles/practice.module.css";

export default function Challenge({ text, highlightedChars }) {
  return (
    <div className={css.check_Text}>
      <p>
        {text.split("").map((char, index) => (
          <span
            key={index}
            className={
              highlightedChars[index] == true ? css.correct : css.incorrect
            } // Highlighting the colors on the basis of boolean values
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
