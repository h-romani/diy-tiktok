const CLOUD_NAME = "deoxmgxq6";
const UPLOAD_PRESET = "DIY-Tiktok";

export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  console.log("CLOUDINARY RESPONSE:", data);

  return {
    url: data.secure_url,
    public_id: data.public_id
  };
}