export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <nav>Sidebar Nav</nav>
      </aside>
      {/* Main */}
      <div className="flex flex-col flex-1">
        <header className="h-16 bg-white border-b px-4 flex items-center">Header</header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <footer className="h-12 border-t px-4 flex items-center text-sm text-gray-500">Footer</footer>
      </div>
    </div>
  );
}
