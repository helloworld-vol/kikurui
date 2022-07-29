import type { NextPage } from "next";
import styles from "./index.module.scss";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Test</h1>

      <button
        className={styles.sumitButton}
        onClick={() => {
          fetch("/api/niconico", { method: "POST" })
            .then(() => alert("OK!"))
            .catch(console.error);
        }}
      >
        hoge
      </button>
    </div>
  );
};

export default Home;
