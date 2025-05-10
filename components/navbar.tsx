import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold hover:text-gray-300">
          Home
        </Link>
        <Link href="/favorites" className="text-lg hover:text-gray-300">
          Favorites
        </Link>
      </div>
    </nav>
  )
}