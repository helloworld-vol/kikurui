import Link from "next/link";

import styles from "./PageHeader.module.scss";

import KikuruiLogo from "assets/svg/kikurui-logo.svg";

export const PageHeader = () => {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.container}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <KikuruiLogo className={styles.logo} />
            <span className={styles.title}>Kikurui</span>
          </div>
        </Link>

        <nav className={styles.navi}>
          <Link href="#">
            <a className={styles.naviItem}>サイトの使い方</a>
          </Link>

          <Link href="#">
            <a className={styles.naviItem}>ご連絡</a>
          </Link>

          <Link href="#">
            <a className={styles.naviItem}>GitHub</a>
          </Link>
        </nav>
      </div>
    </header>
  );
};
