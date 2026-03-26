import { useState } from 'react'
import supabase from '../supabase-client.js'

export default function SalesForm({ reps }) {
    const [status, setStatus] = useState('')

    const addDeal = async (formData) => {
        const name = formData.get('rep_name')
        const amount = formData.get('deal_amount')

        setStatus('Submitting...')

        const { error } = await supabase
            .from('sales_deals')
            .insert([{ name, value: parseFloat(amount) }])

        if (error) {
            console.error('Error adding deal:', error)
            setStatus('Error: ' + error.message)
        } else {
            setStatus('Success! Deal added.')
        }
    }

    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700 max-w-sm mx-auto my-8">
            <h3 className="text-xl font-bold text-white mb-6">Add New Sales Deal</h3>
            <form action={addDeal} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Sales Representative</label>
                    <select 
                        name="rep_name"
                        className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    >
                        {reps.map(rep => (
                            <option key={rep.name} value={rep.name}>{rep.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Deal Amount ($)</label>
                    <input 
                        name="deal_amount"
                        type="number" 
                        required 
                        placeholder="e.g. 1500"
                        className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-medium"
                    />
                </div>

                <SubmitButton />

                {status && (
                    <p className={`text-center text-sm font-medium ${status.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                        {status}
                    </p>
                )}
            </form>
        </div>
    )
}

function SubmitButton() {
    // You can also use useFormStatus here if you need loading state
    return (
        <button 
            type="submit" 
            className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg"
        >
            Add Deal
        </button>
    )
}
