export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
        <p>© {new Date().getFullYear()} MarketReply AI. Built with Gemini 2.5 Flash.</p>
        <p>React · Spring Boot · MongoDB Atlas</p>
      </div>
    </footer>
  )
}
