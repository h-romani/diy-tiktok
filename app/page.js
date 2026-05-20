import Feed from "@/components/Feed";
import Menu from "@/components/Menu";

export default function Page() {
  return (
   
      <>
      <div className="topbar">
          <Menu />
      </div>
      
      <Feed />
      
      </>
  
  );
}