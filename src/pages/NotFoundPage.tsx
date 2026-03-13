import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-1 text-sm text-slate-600">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Go to marketplace
      </Link>
    </div>
  )
}

