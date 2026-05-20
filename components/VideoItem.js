"use client";

import { useRef, useState } from "react";
import { doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function VideoItem({ video }) {
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(false);
  const [title, setTitle] = useState(video.title || "Untitled");
  const videoRef = useRef(null);
  const hasCounted = useRef(false);

  const handleDelete = async () => {
    try {
      // (deletes Cloudinary)
      const res = await fetch("/api/delete-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(video)
      });
      
      const data = await res.json();
      console.log("DELETE RESPONSE:", data);
  
      // delete from Firestore
      await deleteDoc(doc(db, "videos", video.id));
  
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleProgress = async (e) => {
    const vid = e.target;
  
    if (!vid.duration) return;
  
    const percentWatched = vid.currentTime / vid.duration;
  
    if (percentWatched < 0.9) return;
    if (hasCounted.current) return;
  
    hasCounted.current = true;

    if (!video?.id) {
        console.warn("Missing video.id", video);
        return;
      }
  
    try {
      const ref = doc(db, "videos", video.id);
  
      await updateDoc(ref, {
        views: increment(1)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlay = (e) => {
    const vid = e.target;

    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  };

  const saveTitle = async () => {
    try {
      const videoRef = doc(db, "videos", video.id);
  
      await updateDoc(videoRef, {
        title: title
      });
  
      setOpen(false);
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">

        <div className="video-title-row">
          <div
            className="video-title"
            onClick={() => setOpen(true)}
            style={{ cursor: "pointer" }}
          >
          {video.title}
          </div>

          <div className="video-views">
              <FontAwesomeIcon icon={faEye} /> {video.views || 0}
          </div>
        </div>

        <video
            ref={videoRef}
            src={video.url}
            playsInline
            preload="metadata"
            loop={false}
            onClick={togglePlay}
            onTimeUpdate={handleProgress}
        />

          <div
              className="delete-btn"
              onClick={() => setDel(true)}
              >
              <FontAwesomeIcon icon={faTrash} 
              />
              
          </div>
       
        {open && (
          <div className="modal-backdrop" onClick={() => setOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Title</h3>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

            <button onClick={saveTitle}>
            Save
            </button>
            </div>
          </div>
        )}

        {del && (
          <div className="modal-backdrop" onClick={() => setDel(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Are you sure you want to permanently delete this video?</h4>
              <button onClick={handleDelete}>Yes</button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}