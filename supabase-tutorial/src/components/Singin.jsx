import { useAuth } from "../context/AuthContex"

const Singin = () => {
    const { session } = useAuth();
    console.log(session);


    return (
        <>
          <h1 className='text-2xl font-bold'>Sign In</h1>
          <form action="">
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign In</button>
          </form>
        </>
    )
}

export default Singin