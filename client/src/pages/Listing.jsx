import { useEffect, useState } from "react"
import { useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from'swiper/react';
import SwiperCore from'swiper';
import { Navigation} from'swiper/modules';
import {useSelector} from'react-redux';
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [ listing, setListing ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false); 
    const params = useParams();
    const currentUser = useSelector(state => state.user.currentUser);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const listingId = params.listingId
                console.log(listingId);
                const res = await fetch(`/api/listing/get/${listingId}`)
                const data = await res.json()
                console.log(data);
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                return              
            } catch (error) {
                setError(true);
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])
  return (
    <main>
        {loading && <p className="text-center my-6 text-2xl">Loading...</p>}
        {error && <p className="text-red-700 text-center my-7 text-2xl">Something went wrong!</p>}
        {listing && !loading && !error && (
        <><Swiper navigation>
                  {listing.imageUrls.map((url, index) => (
                      <SwiperSlide key={index}>
                          <div
                              className="h-[300px]"
                              style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                          >
                          </div>
                      </SwiperSlide>
                  ))}
            </Swiper>
            <div 
                className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100">
                <FaShare 
                    className="text-slate-500 cursor-pointer"
                    onClick={()=>{
                        navigator.clipboard.writeText(window.location.href)
                        setCopied(true)
                    }}
                />
            </div>
            {copied && setTimeout(() => setCopied(false), 2000) && (
                <p 
                    className="fixed top-[23%] right-[3%] z-10 rounded-md bg-slate-100 p-2 font-semibold">Link copied!
                </p>
            )}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                <p
                    className="text-2xl font-semibold"
                >
                    {listing.name} - ${" "}{
                    listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')
                    }
                    {listing.type === 'rent' && ' / moth'}
                </p>
                <p className="flex items-center gap-2 text-slate-800 my-2 text-sm">
                    <FaMapMarkerAlt className="text-green-700" />
                    {listing.address}
                </p>
                <div className="flex gap-4">
                    <p className="bg-red-900 w-full max -w-[200px] text-white text-center p-1 rounded-md">
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </p>
                    {
                        listing.offer && (
                            <p className="bg-green-900 w-full max -w-[200px] text-white text-center p-1 rounded-md">
                                ${+listing.regularPrice - +listing.discountPrice}
                            </p>
                        )
                    }
                </div>
                <p className="text-slate-800">
                    <span className="font-semibold text-black">Description - {' '} </span>
                    {listing.description}
                </p>
                <ul className="flex items-center ite gap-4 sm:gap-6 text-green-900 font-semibold text-sm flex flex-wrap"> 
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBed className="text-green-700 text-lg" />
                        {listing.bedrooms > 1? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBath className="text-green-700 text-lg" />
                        {listing.bathrooms > 1? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bath`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaParking className="text-green-700 text-lg" />
                        {listing.parking ? 'Parking Spot' : 'No Parking'}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaChair className="text-green-700 text-lg" />
                        {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </li>
                </ul>
                {currentUser && listing.userRef !== currentUser._id && !contact &&(
                <button
                    onClick={() => setContact(true)} 
                    className="bg-slate-700 text-white rounded-lg uppercase hover: opacity-90 p-3"
                >
                    Contact Landlord
                </button>
                )}
                {contact && <Contact listing={listing}/>}
            </div>
            </>
        )}
    </main> 
  )
}
