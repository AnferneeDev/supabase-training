import { useActionState, useEffect } from 'react'
import { useAuth } from '../context/AuthContex'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Singup = () => {
    const { session, handleSignUp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        }
    }, [session])

    const [error, submitAction, isPending] = useActionState(
        async (prevState, formData) => {
            const email = formData.get('email')
            const password = formData.get('password')

            const result = await handleSignUp(email, password);

            if (result.error) {
                return result.error;
            }

            if (result.success) {
                // For Sign Up, many providers require email verification.
                // If it's already logged in, navigate. Otherwise show a message.
                if (result.data?.session) {
                    navigate('/dashboard');
                }
                return "Account created! Please check your email for a verification link.";
            }
        }, 
        null
    )

    return (
        <div className="p-8 max-w-sm mx-auto bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl mt-20">
            <h1 className='text-3xl font-black text-white mb-8 tracking-tighter'>Create Account</h1>
            
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
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-wait"
                >
                    {isPending ? 'Creating Account...' : 'Sign Up'}
                </button>

                {error && (
                    <p className={`text-center text-sm font-medium px-4 py-2 rounded-lg ${error.includes('Check your email') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {error}
                    </p>
                )}
            </form>
            <p className="text-center text-sm font-medium px-4 py-2 rounded-lg bg-red-500/10 text-red-400 mt-4">
                Already have an account? <Link to="/">Sign In</Link>
            </p>
        </div>
    )
}

export default Singup
