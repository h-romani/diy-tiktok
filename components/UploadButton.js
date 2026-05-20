"use client";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function UploadButton({ category = "main", onUpload })  {

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
  
    for (const file of files) {
      const result = await uploadToCloudinary(file);
  
      const newVideo = {
        url: result.url,
        public_id: result.public_id,
        type: "video",
        title: file.name,
        createdAt: Date.now(),
        views: 0,
        category: category
      };
  
      onUpload?.(newVideo);
  
      // firestore saving in background
      await addDoc(collection(db, "videos"), newVideo);
    }
  };

  return (
    <label className="menu-item">
      Upload Video
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleUpload}
        hidden
      />
    </label>
  );
}