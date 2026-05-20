"use client";

import { useState, useEffect } from "react";
import UploadButton from "./UploadButton";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState(["main"]);
  const [activeFeed, setActiveFeed] = useState("main");

  const PRIORITY = ["main"];

  useEffect(() => {
    const handler = (e) => {
      setCategories(e.detail);
    };
  
    window.addEventListener("categories-update", handler);
  
    return () => window.removeEventListener("categories-update", handler);
  }, []);


  return (
    <div className="topbar">

      <div className="topbar-left">
        {[...categories]
          .sort((a, b) => {
            const aIndex = PRIORITY.indexOf(a);
            const bIndex = PRIORITY.indexOf(b);

            // both in priority list
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

            // only a is priority
            if (aIndex !== -1) return -1;

            // only b is priority
            if (bIndex !== -1) return 1;

            // normal alphabetical for rest
            return a.localeCompare(b);
          })
          .map((cat) => (
            
          <button
            key={cat}
            className={activeFeed === cat ? "active" : ""}
            onClick={() => {
              setActiveFeed(cat);

              window.dispatchEvent(
                new CustomEvent("feed-change", {
                  detail: cat
                })
              );
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="topbar-right">

        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <div className="menu-panel">
            <UploadButton />
          </div>
        )}

      </div>

    </div>
  );
}