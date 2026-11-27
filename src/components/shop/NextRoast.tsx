"use client";

import { useEffect, useState } from "react";
import { nextRoastDay } from "@/lib/shop";

/* "Next roast: Friday". Worked out in the roastery's time zone after mount
   (the page is static, so the build date would go stale); until then it
   shows the standing schedule. The value sits right-aligned at the end of
   its row, so the swap moves nothing else, and it never reserves more
   width than the row has (narrow tablet columns). */
export function NextRoast() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const next = nextRoastDay(new Date());
      setLabel(next.daysAway === 0 ? "Today, order by noon" : next.label);
    };
    update();
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="text-right">{label ?? "Tue & Fri"}</span>;
}
