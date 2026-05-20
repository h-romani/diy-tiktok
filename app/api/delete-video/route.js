import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export async function POST(req) {
  try {
    const { public_id, id } = await req.json();

    if (!public_id || !id) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video"
    });
    
    console.log("Cloudinary result:", result);

    // delete from Firestore (client-safe approach below)
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}