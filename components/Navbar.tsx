import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-black tracking-widest">
          INKWAVE <span className="bg-inkwave-gradient bg-clip-text text-transparent">PRINTS</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/90">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
