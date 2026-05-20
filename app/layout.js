import "./globals.css";

export const metadata = {
  title: "DIY TikTok Feed",
  description: "Video feed app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}