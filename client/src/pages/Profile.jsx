import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js'



// firebase storage
// allow write: if
// request.resource.size < 2 *1024 * 1024 &&
// request.resource.contentType.matches('image/.*')

export default function Profile() {
  const fileRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword? FaEye : FaEyeSlash;
  const {currentUser} = useSelector((state) => state.user);
  const[file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [ formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  // console.log(formData);
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
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=> setFormData({...formData, avatar: downloadURL}))
      }
    )
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>
      <form className="flex flex-col gap-4" >
        <input onChange={(e)=>setFile(e.target.files[0])} type="file"  ref={fileRef} hidden accept="image/.*"/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
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
        <input type="text" placeholder="username" id="username"className="border p-3 rounded-lg"/>
        <input type="text" placeholder="email" id="email"className="border p-3 rounded-lg"/>
        <div className='bg-white p-3 border rounded-lg flex justify-between'>
        <input
          type={showPassword? 'text' : 'password'}
          placeholder='password'
          className='flex-grow bg-transparent focus:outline-none w-24 sm:w-64'
          id='password'
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className='focus:outline-none text-gray-500'>
          <PasswordIcon className='text-slate-600'/>
        </button>
      </div>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
