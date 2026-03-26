import { useEffect, useState } from 'react'
import supabase from './supabase-client.js'
import { Chart } from 'react-charts'
import SalesForm from './Form.jsx'


function App() {
  return (
    <>
    <Header />
    <Dashboard />
    </>
  )
}

function Header(){
  return(
    <>
    <div className='w-full bg-green-300 h-20 flex justify-center items-center'>
      <header className='text-2xl font-bold'>Sales Team Dashboard</header>
    </div>
    </>
  )
}

function Dashboard(){

  const [sales, setSales] = useState([])

  async function fetchSales(){
    try{ 
    const { data, error } = await supabase
    .from('sales_by_rep')
    .select(
      `
      name,
      total_sales
      `,
    ).order('total_sales', { ascending: false })
    .limit(10) 
    
    if(error){
      throw error
    }
    
    setSales(data)  
    } catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSales()

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


  return(
   <div className='border-2 border-black h-150 flex justify-center'>
     <div className='flex flex-row w p-4 gap-10'>
      
      <div className='h-96 w-full p-4'><h2>Total Sales This Quarter</h2>
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
      <SalesForm reps={sales} />
     </div>
   </div>   )
}

export default App
