import Link from 'next/link';

export default function InteractiveLesson() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white antialiased">
      {/* Main Navigation */}
      <header className="flex items-center justify-between border-b border-solid border-white/10 px-10 py-3 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </g>
              <defs><clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath></defs>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">APEX AI Tutor</h2>
        </div>
        <div className="flex flex-1 justify-center gap-8">
          <Link className="text-white/70 hover:text-white text-sm font-medium transition-colors" href="/lesson/1">Lessons</Link>
          <Link className="text-white/70 hover:text-white text-sm font-medium transition-colors" href="#">Notes</Link>
          <Link className="text-white/70 hover:text-white text-sm font-medium transition-colors" href="#">Flashcards</Link>
          <Link className="text-white/70 hover:text-white text-sm font-medium transition-colors" href="/lesson/1/summary">Progress</Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-white/5 hover:bg-white/10 text-white transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-primary/40" data-alt="Student profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBaih4JwW4Bdm3I4ERAdfaqv3-6_qNtwzfpArBmrZv5RaIglJnG7xx4VTW-mPzWGJgTBX9DB90F0VloqYKEis-jt0C9koG3aQC8vF9xhQ9j1V1KsyYjJBs69xz3Y82OcEvAs6WQV2BuMfNw9e7uU8JXgnpwpcVTmGWfw8sE_FTGIA_xAUOoDOKlr7QnnLbKtNYf-DubJkIETG1zyDXujt1wwP8WAmQR5TrdXbzmBMmjTPxs5Vqvxw9iNC10wc3uLRHCvj5yBZ71Z8")' }}></div>
        </div>
      </header>
      <main className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        {/* Background Video (Dimmed/Paused State) */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full bg-cover bg-center grayscale-[0.5] contrast-[0.8]" data-alt="Dimmed video frame of a biological laboratory" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDG8pBtcwEJcivavfUeGEiaVCqypGCuN9RJwUQwcf1q7GU5N8wh9gxGtisGW0XcCX2h_ZzP9mReRl2eORsgOssUI_0NR93NodNDHTICRCzuzdlHQzczn9XKVpfgMp0ujy_pOHGx2n_vLMC0Tok7EwlZ4-q4JSDDosDbbQqH3X2V69OnpXPVuGoMpbpzvj3a6eWNXlos8NX26d1rHMeL356HmOBWnF8umlSchjrrUQqkEJd3jOlPGm0zWxpMc-qepJAtPMyOOYJAZIg")' }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
          </div>
        </div>
        {/* Layout Wrapper */}
        <div className="relative z-10 flex h-full min-h-[calc(100vh-64px)]">
          {/* Side Navigation (Collapsed style for focus mode) */}
          <aside className="w-20 border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-background-dark/40 backdrop-blur-sm">
            <div className="flex flex-col gap-6 flex-1">
              <Link href="/dashboard" className="p-3 text-white/50 hover:text-primary transition-colors"><span className="material-symbols-outlined">home</span></Link>
              <button className="p-3 text-primary bg-primary/10 rounded-xl"><span className="material-symbols-outlined">school</span></button>
              <button className="p-3 text-white/50 hover:text-primary transition-colors"><span className="material-symbols-outlined">folder</span></button>
              <button className="p-3 text-white/50 hover:text-primary transition-colors"><span className="material-symbols-outlined">chat</span></button>
            </div>
            <button className="p-3 text-white/50 hover:text-white"><span className="material-symbols-outlined">logout</span></button>
          </aside>
          {/* Interaction Content */}
          <div className="flex-1 flex flex-col">
            {/* Header Info */}
            <div className="p-8 flex justify-between items-start">
              <div>
                <span className="text-primary text-xs font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 rounded mb-2 inline-block">Interactive Deep-Dive</span>
                <h1 className="text-white text-3xl font-bold">Photosynthesis: The Light-Dependent Reactions</h1>
                <p className="text-white/60 mt-1">Section 4.2 • The Thylakoid Membrane</p>
              </div>
              <Link href="/lesson/1" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all border border-white/10">
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Resume Lesson
              </Link>
            </div>
            {/* Split View Stage */}
            <div className="flex-1 px-8 pb-32 flex gap-8">
              {/* Whiteboard & Diagram Area */}
              <div className="flex-1 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">draw</span>
                    Interactive Whiteboard
                  </h3>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-500/50"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                  </div>
                </div>
                <div className="flex-1 relative p-8">
                  {/* Diagram */}
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat relative" data-alt="Chloroplast diagram with thylakoid membrane highlighted" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCbqr1SdBUB_Pj4C3Cdvc-3gR1WDA_YuEeM8cWO7ArTcAauJywceQIT8jVr9Nqms2FppIRlVloSnCzIpQ1HuYovss4MVl2OXESVAwrPtIPTIgc-EPBAJf3otNZjIMVxD6FHzqLJSajdG1xIShsnGtDZd5Pome1Xh3dUsOdnN0UESvCN36gxy4PUGP-Z0borGmfVX0vu_-GiiPb3kKQKVWKuPs1mIj7Jo7ElRqvfgLE-BKJFthKN75Ccf5AmIoC02xvh5IW0CBc5Rw")' }}>
                    {/* Annotation Overlays */}
                    <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-primary rounded-full animate-pulse shadow-[0_0_20px_rgba(19,91,236,0.5)]"></div>
                    <div className="absolute top-1/2 left-[45%] h-[2px] w-24 bg-primary origin-left rotate-45 shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
                    <div className="absolute top-1/2 left-[60%] bg-primary text-white px-3 py-1 rounded text-xs font-bold">Lumen</div>
                  </div>
                </div>
              </div>
              {/* AI Avatar and Chat History */}
              <div className="w-1/3 flex flex-col gap-6">
                {/* AI Avatar Box */}
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-primary">record_voice_over</span>
                  </div>
                  <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border-2 border-primary/30 shadow-lg">
                    <div className="size-16 rounded-full bg-cover" data-alt="AI Tutor Avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkPiTZhqnokyyidr4r_Ky6fSHv1X2Us6Rsirx5hcEXUVxRmlWFDbDoSmAgQEcCdgzMKBcFjIUYHgahWJpfpjSPfBLl2VxDmGPYmQEExBZQpUa9sASb29xfdyXRCC44oa8-dF7PaAj98A7ibv1Df1ycl7ztFT1cH4lvlOExZGvn02CEIhEnSknX1IEd4ac2P52VRSyTnJDrVVdtG1xSGK-Xkl2i4qNGavxyd47iTAhPFDXo-KvPHjDDswRFb8TT6qv_LoOLvq98AXk")' }}></div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Professor Apex</h4>
                    <p className="text-primary/80 text-sm font-medium">Focusing on Light Absorption</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-1 h-3 bg-primary/40 rounded-full"></div>
                      <div className="w-1 h-5 bg-primary rounded-full"></div>
                      <div className="w-1 h-4 bg-primary/60 rounded-full"></div>
                    </div>
                  </div>
                </div>
                {/* Chat Response Bubble */}
                <div className="flex flex-col gap-4">
                  <div className="bg-white/10 border border-white/10 rounded-xl rounded-tl-none p-5 relative">
                    <p className="text-white leading-relaxed text-sm">
                      &quot;Excellent question! Look at this section of the <span className="text-primary font-bold">Thylakoid membrane</span>. This is where the chlorophyll actually absorbs the light energy. See how the photons interact with the protein complex here?&quot;
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Helpful?</span>
                      <div className="flex gap-2">
                        <button className="size-8 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-all flex items-center justify-center text-white/60">
                          <span className="material-symbols-outlined text-lg">thumb_up</span>
                        </button>
                        <button className="size-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center text-white/60">
                          <span className="material-symbols-outlined text-lg">thumb_down</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* User Question (History) */}
                  <div className="self-end bg-primary rounded-xl rounded-tr-none p-4 max-w-[90%] shadow-lg">
                    <p className="text-white text-sm">Can you show me where the light absorption happens exactly?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Input Dock */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-30 px-4">
          <div className="bg-[#1a2235]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
            <button className="size-12 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <input className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/40 text-sm px-2" placeholder="Ask Professor Apex a follow-up question..." type="text" />
            <button className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
        {/* Feedback & Indicators */}
        <div className="fixed bottom-6 right-8 z-20 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="size-8 rounded-full border-2 border-background-dark bg-cover" data-alt="Student avatar 1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoJjT-68UY1LNia4PQ1EFDDknv63VAP6FEjOmNmYm0QF2h_plo2EESNpfnIpOsmwAsGYex-CWa4sTBvWk_sUD_dIk7JWZmeRNBCl577uGGRLyPNqWxh0QapJGAS9H599tT1-Eg2ILvyQBmJTq-q7ws2LYrtIAYhU_G4aoy0rjHXNB_AWOdBKppi2jV8qNKtV4ETzK5t04kF9MQxTkQ3DtNk_TU7SbFcOMFWXw46z5RR7duXp-Rpci8gVenUW3yWYswGaoLdZ7XbPk")' }}></div>
            <div className="size-8 rounded-full border-2 border-background-dark bg-cover" data-alt="Student avatar 2" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDozMioWgluqTqL9o4rJgBmTXbud2LAg0Qi5Zl1p0q9DBNH41XWFb7o8RNn2228YnyMRcfODau667_Gif1Gx1YjHZyJgZlazq7nZCXxFYYqp5SCLXvh3teM9gAiK-3oyDkdSxy_Bf8VCRe6LXSP2-UrZdp35BdFNz_ggewzjbaSTSQsh2YC_THCQx9Z-Ni4O-J0SLD52SOvGFAwX61Wdlwi3JxXj797pv2Yng-gsoFxr7CR0AppMVz1P8eFdc1TomOoQexu8D6ClWU")' }}></div>
            <div className="size-8 rounded-full border-2 border-background-dark bg-white/10 flex items-center justify-center text-[10px] font-bold">+12</div>
          </div>
          <p className="text-white/40 text-xs font-medium">14 students also paused here</p>
        </div>
      </main>
    </div>
  );
}
