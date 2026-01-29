import Link from 'next/link';

export default function CourseManager() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282e39] bg-background-light dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-4 text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-black leading-tight tracking-[-0.015em] dark:text-white text-black">APEX</h2>
          </Link>
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#9da6b9] flex border-none bg-[#282e39] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#282e39] focus:border-none h-full placeholder:text-[#9da6b9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal" placeholder="Search courses..." defaultValue="" />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <nav className="flex items-center gap-8">
            <Link className="text-[#9da6b9] hover:text-white text-sm font-medium transition-colors" href="/dashboard">Courses</Link>
            <Link className="text-white text-sm font-medium border-b-2 border-primary pb-1" href="/courses/manage">My Library</Link>
            <Link className="text-[#9da6b9] hover:text-white text-sm font-medium transition-colors" href="#">AI Tools</Link>
            <Link className="text-[#9da6b9] hover:text-white text-sm font-medium transition-colors" href="/settings">Settings</Link>
          </nav>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#282e39] text-white hover:bg-[#3b4354] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2iKS5fjF5hhRMWhgKJtbYB2R1MJ6-Y9GMf0Z7dLszx5wVRfT36Yb2GvdpeeD16QD0jZsTytRnSzVJWl30QvmDJNf1tGjEI35QkzTq1EFUfr0BtMc0KvwCnaIxJMiUbdNmExf572nG5IIuqddD-EnwjwAXWysDBtOhZukaFJL9Hk6lVN6BFqPS-XmGhZA3P4K5LfDnLUZTSPT0i7o3GmL2aFjTuDxkr86q0f24t6_l68ENa-cnCS57lQaF5E5qd6HD-JiyyI5eeUQ")' }}></div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-80 border-r border-[#282e39] flex flex-col justify-between bg-background-light dark:bg-background-dark p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h3 className="text-white text-lg font-bold">Linear Algebra</h3>
              <p className="text-[#9da6b9] text-sm">MATH201 • Fall 2024</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider mb-2">AI Syllabus Modules</p>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  <span className="text-sm font-semibold">Syllabus Overview</span>
                </div>
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">category</span>
                  <span className="text-sm font-medium">Vector Spaces</span>
                </div>
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">grid_on</span>
                  <span className="text-sm font-medium">Matrix Operations</span>
                </div>
                <span className="material-symbols-outlined text-sm text-yellow-500">pending</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">function</span>
                  <span className="text-sm font-medium">Determinants</span>
                </div>
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-all cursor-pointer opacity-50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span className="text-sm font-medium">Eigenvalues</span>
                </div>
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-[#282e39] rounded-xl border border-[#3b4354]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-tighter">AI Processing</span>
                <span className="text-xs font-bold text-primary">65%</span>
              </div>
              <div className="h-1.5 w-full bg-[#111318] rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '65%' }}></div>
              </div>
            </div>
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Refresh AI Syllabus</span>
            </button>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#111318]">
          {/* Breadcrumbs & Heading */}
          <div className="px-8 pt-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Link className="text-[#9da6b9] text-sm font-medium hover:text-white" href="/dashboard">Courses</Link>
              <span className="text-[#9da6b9] text-sm font-medium">/</span>
              <span className="text-white text-sm font-medium">Linear Algebra</span>
              <span className="text-[#9da6b9] text-sm font-medium">/</span>
              <span className="text-white text-sm font-medium">Course Materials</span>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-4 pb-8 border-b border-[#282e39]">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Course Materials</h1>
                <p className="text-[#9da6b9] text-base font-normal max-w-xl">Manage your lecture notes, presentations, and assignments. APEX will automatically transform these into interactive lessons.</p>
              </div>
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined">upload_file</span>
                <span>Upload Material</span>
              </button>
            </div>
          </div>
          {/* Grid Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Material Card 1 */}
              <div className="group bg-[#282e39] rounded-xl border border-[#3b4354] overflow-hidden hover:border-primary transition-all">
                <div className="h-32 w-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border-b border-[#3b4354]">
                  <span className="material-symbols-outlined text-5xl text-red-500 group-hover:scale-110 transition-transform">picture_as_pdf</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold truncate">Lecture_01_Vectors.pdf</h4>
                    <button className="text-[#9da6b9] hover:text-white"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9da6b9] mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Oct 12</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">database</span> 2.4 MB</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-colors">Extract AI</button>
                    <button className="w-10 flex items-center justify-center bg-[#111318] rounded-lg border border-[#3b4354] hover:bg-[#3b4354]"><span className="material-symbols-outlined text-sm">download</span></button>
                  </div>
                </div>
              </div>
              {/* Material Card 2 */}
              <div className="group bg-[#282e39] rounded-xl border border-[#3b4354] overflow-hidden hover:border-primary transition-all">
                <div className="h-32 w-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border-b border-[#3b4354]">
                  <span className="material-symbols-outlined text-5xl text-orange-500 group-hover:scale-110 transition-transform">present_to_all</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold truncate">Week2_Slides_Matrices.pptx</h4>
                    <button className="text-[#9da6b9] hover:text-white"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9da6b9] mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Oct 18</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">database</span> 12.1 MB</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 py-2 bg-[#111318] text-[#9da6b9] text-xs font-bold rounded-lg border border-[#3b4354] flex items-center justify-center gap-2">
                      <div className="size-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      Processing...
                    </div>
                    <button className="w-10 flex items-center justify-center bg-[#111318] rounded-lg border border-[#3b4354] hover:bg-[#3b4354]"><span className="material-symbols-outlined text-sm">download</span></button>
                  </div>
                </div>
              </div>
              {/* Material Card 3 */}
              <div className="group bg-[#282e39] rounded-xl border border-[#3b4354] overflow-hidden hover:border-primary transition-all">
                <div className="h-32 w-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-b border-[#3b4354]">
                  <span className="material-symbols-outlined text-5xl text-primary group-hover:scale-110 transition-transform">article</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold truncate">Problem_Set_1.pdf</h4>
                    <button className="text-[#9da6b9] hover:text-white"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9da6b9] mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Oct 20</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">database</span> 0.8 MB</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-colors">Extract AI</button>
                    <button className="w-10 flex items-center justify-center bg-[#111318] rounded-lg border border-[#3b4354] hover:bg-[#3b4354]"><span className="material-symbols-outlined text-sm">download</span></button>
                  </div>
                </div>
              </div>
              {/* Dropzone Empty State */}
              <div className="border-2 border-dashed border-[#3b4354] rounded-xl flex flex-col items-center justify-center p-8 bg-[#111318]/50 hover:bg-primary/5 hover:border-primary transition-all group cursor-pointer h-full min-h-[250px]">
                <div className="size-12 rounded-full bg-[#282e39] flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-white">add</span>
                </div>
                <p className="text-white font-bold text-sm">Add New Resource</p>
                <p className="text-[#9da6b9] text-xs mt-1">Drag and drop files here</p>
              </div>
            </div>
            {/* Summary Row */}
            <div className="mt-12 p-6 bg-[#282e39] rounded-xl border border-[#3b4354] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <p className="text-[#9da6b9] text-xs font-bold uppercase">Total Materials</p>
                  <p className="text-white text-2xl font-black">12</p>
                </div>
                <div className="w-px h-10 bg-[#3b4354]"></div>
                <div className="flex flex-col">
                  <p className="text-[#9da6b9] text-xs font-bold uppercase">Syllabus Length</p>
                  <p className="text-white text-2xl font-black">18 Units</p>
                </div>
                <div className="w-px h-10 bg-[#3b4354]"></div>
                <div className="flex flex-col">
                  <p className="text-[#9da6b9] text-xs font-bold uppercase">Last Sync</p>
                  <p className="text-white text-2xl font-black">2h ago</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#9da6b9] hover:text-white text-sm font-bold transition-colors">
                <span className="material-symbols-outlined">download_done</span>
                Download Course Summary
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
