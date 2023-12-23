import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({listing}) {
    const [Landlord, setLandlord] = useState(null);
    const [ message, setMessage ] = useState(' ');
   // const [ error, setError ] = useState(false);

   const onChange = (e) => {
    setMessage(e.target.value)
   }

    useEffect(() => {
        const fetchLandlord = async() =>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
                setError(false)
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord()
    }, [listing.userRef])

  return (
    <>
    {Landlord && (
        <div className="flex flex-col gap-2">
            <p>Contact 
                <span className="font-semibold">{Landlord.username}</span>
                 for 
                <span className="font-semibold">{listing.name.toLowerCase()}</span>
            </p>
            <textarea 
                name="message" 
                id="message" 
                rows="2" 
                value={message}
                onChange={onChange}
                placeholder="Enter your message here..."
                className="w-full p-3 rounded-lg border"
            ></textarea>
            <Link
                to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className="bg-slate-700 text-white rounded-lg text-center uppercase hover: opacity-95 p-3"
            >
                Send message
            </Link>
        </div>
    )}
    </>
  )
}
