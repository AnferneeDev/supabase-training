import { useState } from 'react'

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
  return(
   <div className='border-2 border-black h-screen flex justify-center items-center'>
     <div>
      <h2>Total Sales This Quarter</h2>
      <p>$123,456.78</p>
     </div>
   </div> 
  )
}

export default App
