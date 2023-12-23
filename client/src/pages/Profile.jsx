import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
 } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

// firebase storage
// allow write: if
// request.resource.size < 2 *1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

export default function Profile() {
  // Defining pieses of state
  const fileRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword? FaEye : FaEyeSlash;
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const[file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [ showListingsError, setShowListingsError] = useState(false);
  const [ userListings, setUserLintings] = useState([]);
  const [ listingDeleteError, setListingDeleteError] = useState(false);

  //console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(file)
  useEffect(() => {
    if (file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error)=> {
      setFileUploadError(true);
    },
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
       setFormData({...formData, avatar: downloadURL}))
      }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      //console.log('data in update: ' + JSON.stringify(data));
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
    console.log(formData);

  }
   const handleDeleteUser=async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data))
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOutUser = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async() => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserLintings(data)
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async(listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setListingDeleteError('Could not delete listing');
        return;
      }
      setUserLintings((prev) => prev.filter((listing) => listing._id!== listingId));
    } catch (error) {
      setListingDeleteError('Listing deleted failed');
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>
      <form
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4" 
       >
        <input 
          onChange={(e)=>setFile(e.target.files[0])} 
          type="file"  
          ref={fileRef} 
          hidden accept="image/.*"
        />
        <img 
          onClick={()=>fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" 
        />
        <p 
          className="text-sm self-center"
        >
          {fileUploadError ?
          (<span className="text-red-700">
            Error Image upload (image must be less than 2MB)
          </span>)  :
          filePerc > 0  && filePerc < 100? (
            <span className="text-slate-700">
              {`Uploading ${filePerc}`}%
            </span>)
            :
            filePerc === 100 ? (
              <span className="text-green-700">
                Image Successfully uploaded!
              </span>)
              : (
              ""
              )        
          }
        </p>
        <input 
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg" onChange={handleChange}
          /> 
        <input 
          type="text"
          placeholder="email"
          defaultValue={currentUser.email} 
          id="email" 
          className="border p-3 rounded-lg" 
          onChange={handleChange}
        />
        <div className='bg-white p-3 border rounded-lg flex justify-between'>
        <input
          type={showPassword? 'text' : 'password'}
          placeholder='password'
          className='flex-grow bg-transparent focus:outline-none w-24 sm:w-64'
          id='password'
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          className='focus:outline-none text-gray-500'
        >
          <PasswordIcon className='text-slate-600'/>
        </button>
      </div>
        <button 
          disabled={loading} 
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : "Update"}
        </button>
        <Link className="bg-green-700  text-white text-center rounded-lg p-3 uppercase hover:opacity-95" to={'/create-listing'}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span 
          onClick={handleDeleteUser} 
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span 
          onClick={handleSignOutUser} 
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <p 
        className="text-red-700 mt-5 text-center " 
      >
        {error? error :''}
      </p>
      <p 
        className="text-green-700 mt-5 text-center " 
      >
        {updateSuccess? "User is updated successfully!" :''}
      </p>
      <button
        className="text-green-700 text-center w-full rounded-lg p-3 hover:opacity-95"
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      <p 
        className="text-red-700 mt-5 text-center " 
      >
        {showListingsError? 'Error showing listings' :''}
      </p>     
      {userListings &&  userListings.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
        {userListings.map((listings, index)=> (
          <div
            key={index}
            className="border p-3 rounded-lg flex  justify-between items-center gap-4"
          >
            <Link to={`/listing/${listings._id}`} className="text-blue-700">
              <img 
                src={listings.imageUrls[0]} 
                alt="listing cover" 
                className="h-16 w-16 object-contain rounded-lg"
              />
            </Link>
            <Link
              className="flex-1 text'slate-700 font-semibold hover:underline truncate"
              to={`/listing/${listings._id}`}
            >
              <p>{listings.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleListingDelete(listings._id)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listings._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
      ))     
       }
      </div>
      }
      
      <p
        className="text-red-700 mt-5 text-center " 
      >
        {listingDeleteError? listingDeleteError :''}
      </p>
    </div>
  )
}
