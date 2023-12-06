import { useEffect, useMemo } from "react";

export default function ScrollToTop() {
  useMemo(() => {
    window.scrollTo(0, 0);
  }, [window.location.href]);

  return null;
}
