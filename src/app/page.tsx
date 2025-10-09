import Navbar from "@/components/Navbar";
import Products from "../components/Products";

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col py-20 px-4">
        <header>
           <Navbar />
        </header>
        <Products />
    </div>
  );
}
