import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import SellerForm from '../components/seller/SellerForm.jsx'
import ProductCard from '../components/seller/ProductCard.jsx'
import Loader from '../components/common/Loader.jsx'
import Button from '../components/common/Button.jsx'
import { useSeller } from '../hooks/useSeller.js'
import { sellerService } from '../services/sellerService.js'

export default function SellerSettings() {
  const { sellers, activeSellerId, setActiveSellerId, loading, refreshSellers } = useSeller()
  const [showForm, setShowForm] = useState(false)
  const [editingSeller, setEditingSeller] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const openCreate = () => { setEditingSeller(null); setShowForm(true) }
  const openEdit = (seller) => { setEditingSeller(seller); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setFormError(null) }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    setFormError(null)
    try {
      if (editingSeller) {
        await sellerService.update(editingSeller.id, payload)
      } else {
        const created = await sellerService.create(payload)
        setActiveSellerId(created.id)
      }
      await refreshSellers()
      setShowForm(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this seller profile? This cannot be undone.')) return
    await sellerService.remove(id)
    await refreshSellers()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Seller settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your product listings and negotiation rules.</p>
        </div>
        {!showForm && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New profile
          </Button>
        )}
      </div>

      {/* Form renders inline in the page flow (not a popup), so normal page
          scrolling always works no matter how tall the form gets. */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900">
              {editingSeller ? 'Edit seller profile' : 'New seller profile'}
            </h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl bg-rose-50 text-rose-700 text-sm px-4 py-3 flex items-center justify-between">
              {formError}
              <button onClick={() => setFormError(null)}><X className="h-4 w-4" /></button>
            </div>
          )}

          <SellerForm initialValue={editingSeller} onSubmit={handleSubmit} submitting={submitting} />
        </div>
      )}

      {loading ? (
        <Loader label="Loading seller profiles…" className="py-16 justify-center" />
      ) : sellers.length === 0 && !showForm ? (
        <div className="card p-10 text-center">
          <p className="text-slate-500">No seller profiles yet. Create one to start getting AI-drafted replies.</p>
          <Button onClick={openCreate} className="mt-4 mx-auto">
            <Plus className="h-4 w-4" /> Create seller profile
          </Button>
        </div>
      ) : (
        !showForm && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sellers.map((seller) => (
              <ProductCard
                key={seller.id}
                seller={seller}
                active={seller.id === activeSellerId}
                onSelect={setActiveSellerId}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
