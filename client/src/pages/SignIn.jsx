import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword? FaEye : FaEyeSlash;
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector(state => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
     });
    };
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      dispatch(signInStart());
      //setLoading(true)
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success=== false) {
        dispatch(signInFailure(data.message));
        return
      }
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      

    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
      <div className='bg-white p-3 border rounded-lg flex items-center'>
        <input
          type={showPassword? 'text' : 'password'}
          placeholder='password'
          className='flex-grow bg-transparent focus:outline-none w-24 sm:w-64'
          id='password'
          onChange={handleChange}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className='focus:outline-none text-gray-500'>
          <PasswordIcon className='text-slate-600'/>
        </button>
      </div>
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Sign In'}</button>
    </form>



      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sing Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
