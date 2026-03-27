import { useActionState, useEffect } from 'react'
import { useAuth } from '../context/AuthContex'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Singin = () => {
    const { session, handleSignIn } = useAuth();  
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        }
    }, [session])
    /* 
    Challenge: 
    * 1) Import the 'useActionState' hook
    * 2) Call the hook at the top level of the component, destructuring three:
    *    - 'error' (state for error handling)
    *    - 'submitAction' (the form action function)
    *    - 'isPending' (loading state boolean)
    */
    const [error, submitAction, isPending] = useActionState(
        async (prevState, formData) => {
            const email = formData.get('email')
            const password = formData.get('password')

            const result = await handleSignIn(email, password);

            if (result.error) {
                return result.error;
            }

            if (result.success) {
                navigate('/dashboard');
                return null;
            }
        }, 
        /* 
        *    - Second argument: initial state value of null 
        */
        null
    )

    return (
        <div className="p-8 max-w-sm mx-auto bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl mt-20">
            <h1 className='text-3xl font-black text-white mb-8 tracking-tighter'>Sign In</h1>
            
            {/* 
            * 5) Add the 'submitAction' to your form's action prop 
            */}
            <form action={submitAction} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Email</label>
                    <input 
                        name="email"
                        type="email" 
                        required 
                        placeholder="Email" 
                        className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Password</label>
                    <input 
                        name="password"
                        type="password" 
                        required 
                        placeholder="Password" 
                        className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-wait"
                >
                    {isPending ? 'Signing In...' : 'Sign In'}
                </button>

                {error && (
                    <p className="text-center text-sm font-medium px-4 py-2 rounded-lg bg-red-500/10 text-red-400">
                        {error}
                    </p>
                )}
            </form>
            <p className="text-center text-sm font-medium px-4 py-2 rounded-lg bg-red-500/10 text-red-400">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    )
}

export default Singin