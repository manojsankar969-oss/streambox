import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-20 border-t border-white/5 bg-[#050505] flex flex-col items-center gap-12 px-8">
      <span className="text-[#FFBF00] font-black font-epilogue uppercase tracking-[0.5em] text-3xl">CINEMA</span>
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
        <Link href="#" className="text-zinc-600 font-epilogue text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#FFBF00] transition-colors">Privacy Policy</Link>
        <Link href="#" className="text-zinc-600 font-epilogue text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#FFBF00] transition-colors">Terms of Service</Link>
        <Link href="#" className="text-zinc-600 font-epilogue text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#FFBF00] transition-colors">Help Center</Link>
        <Link href="#" className="text-zinc-600 font-epilogue text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#FFBF00] transition-colors">Cookie Preferences</Link>
      </div>
      <p className="text-zinc-700 font-epilogue text-[10px] font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} Digital Cinema. The Pinnacle of Cinematic Curation.
      </p>
    </footer>
  )
}