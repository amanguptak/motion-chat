import AboutPage from "../components/about";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] flex flex-col items-center justify-center py-8 space-y-8">
      {/* Header */}
      <header className="text-center">
        <p className="text-5xl  font-extrabold text-yellow-400">Motion Otaku</p>
        <p className="text-lg text-white mt-2">Connect seamlessly with the world</p>
      </header>

    

 
     
        <AboutPage />
     
    </div>
  );
}
