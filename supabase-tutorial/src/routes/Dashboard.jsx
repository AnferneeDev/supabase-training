import { useEffect, useState } from 'react'
import supabase from '../supabase-client.js'
import { Chart } from 'react-charts'
import SalesForm from '../components/Form.jsx'
import { useAuth } from '../context/AuthContex.jsx'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { session, handleSignOut } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([])
  const [profiles, setProfiles] = useState([])

  async function fetchSales() {
    try {
      const { data, error } = await supabase
        .from('sales_by_rep')
        .select(`name, total_sales`)
        .order('total_sales', { ascending: false })
        .limit(10)

      if (error) throw error
      setSales(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name')
      
      if (error) throw error
      setProfiles(data)
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

  useEffect(() => {
    fetchSales()
    fetchProfiles()

    const channel = supabase.channel('sales-changes').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sales_deals',
      },
      (payload) => {
        console.log('Change received!', payload)
        fetchSales()
      }
    ).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])


  // GUARD: If we are still loading (undefined) or if they are logged out (null)
  // we shouldn't try to render the email yet!
  if (!session) {
    return (
      <div className="flex items-center justify-center min-vh-100">
        <p className="text-xl animate-pulse">Loading session...</p>
      </div>
    )
  }

  return (
    <div className='border-2 border-black h-150 flex justify-center'>
      <div className='flex flex-row w p-4 gap-10'>
        <div className='h-96 w-full p-4'>
          <button className='bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg' onClick={handleSignOut}>Sign Out</button>
          <p> email: {session.user.email}</p>
          <h2>Total Sales This Quarter</h2>
          {sales.length > 0 ? (
            <Chart
              options={{
                data: [
                  {
                    label: 'Sales Reps',
                    data: sales.map((sale) => ({
                      primary: sale.name,
                      secondary: sale.total_sales,
                    })),
                  },
                ],
                primaryAxis: {
                  type: 'ordinal',
                  getValue: (datum) => datum.primary,
                },
                secondaryAxes: [
                  {
                    type: 'linear',
                    min: 0,
                    getValue: (datum) => datum.secondary,
                    elementType: 'bar',
                  },
                ],
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 animate-pulse">Loading sales data...</p>
            </div>
          )}
        </div>
        <SalesForm profiles={profiles} />
      </div>
    </div>
  )
}
