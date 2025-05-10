import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          GitHub Explorer
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            href="/"
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/favorites"
            className="text-lg font-medium hover:text-gray-300 transition-colors"
          >
            Favorites
          </Link>
        </div>
      </div>
    </nav>
  )
}