"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import VideoItem from "./VideoItem";

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [activeFeed, setActiveFeed] = useState("main");

  useEffect(() => {
    const handler = (e) => {
      setActiveFeed(e.detail);
    };
  
    window.addEventListener("feed-change", handler);
  
    return () => window.removeEventListener("feed-change", handler);
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const category = (v.category || "main").trim().toLowerCase();
      return category === activeFeed;
    });
  }, [videos, activeFeed]);

  const categories = useMemo(() => {
    const set = new Set();
  
    videos.forEach((v) => {
      const cat = (v.category || "main").trim().toLowerCase();
      set.add(cat);
    });
  
    return Array.from(set);
  }, [videos]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("categories-update", {
        detail: categories
      })
    );
  }, [categories]);

  useEffect(() => {
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );
  
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setVideos(data);
    });
  
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!filteredVideos.length) return;
  
    const container = document.querySelector(".feed");
    if (!container) return;
  
    const videoElements = container.querySelectorAll("video");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          const video = entry.target;
  
          if (entry.isIntersecting) {
            videoElements.forEach((v) => {
              if (v !== video) v.pause();
            });
  
            try {
              if (video.readyState < 3) video.load();
              await video.play();
            } catch {}
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );
  
    videoElements.forEach((v) => observer.observe(v));
  
    return () => observer.disconnect();
  }, [videos, activeFeed]);


  return (
    <>
      <div className="feed-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFeed(cat)}
            className={activeFeed === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>
    
      <div className="feed">
        {filteredVideos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </>
  );
}