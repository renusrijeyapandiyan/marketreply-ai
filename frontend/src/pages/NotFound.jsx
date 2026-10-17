import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="page grid min-h-[60vh] place-items-center text-center">
      <div><p className="font-display text-7xl font-extrabold text-brand-600">404</p><h1 className="mt-2 text-2xl font-bold">We couldn't find that page</h1>
        <Link to="/" className="btn-primary mt-6">Back to the shop</Link></div>
    </div>
  )
}
