export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.3),transparent_40%)]" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-6">
          A Universe Begins
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
          Our Universe
        </h1>

        <p className="max-w-xl mx-auto text-zinc-400 text-lg leading-8 mb-10">
          Every story begins with someone.
          Every universe begins with a connection.
        </p>

        <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300">
          Begin The Story
        </button>
      </div>
    </main>
  );
}