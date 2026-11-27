"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./back-to-top.module.css";

function subscribe(onScroll: () => void) {
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

const getSnapshot = () => window.scrollY > 480;
const getServerSnapshot = () => false;

export function BackToTop() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <a
      href="#top"
      className={styles.button}
      aria-label="回到最上面"
      title="回到最上面"
      hidden={!visible}
    >
      <ArrowUp size={22} aria-hidden="true" />
    </a>
  );
}
