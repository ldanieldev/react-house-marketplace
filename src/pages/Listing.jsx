import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { A11y, Autoplay, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import shareIcon from '../assets/svg/shareIcon.svg';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config.js';

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const priceRegex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  const onClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);

    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[A11y, Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
      >
        {listing.imageUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className='swiperSlideDiv'
                style={{
                  background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  backgroundSize: 'contain'
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className='shareIconDiv' onClick={onClick}>
        <img src={shareIcon} alt='share' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {(listing.offer ? listing.discountedPrice : listing.regularPrice)
            .toString()
            .replace(priceRegex, ',')}
        </p>

        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>

        {listing.offer && (
          <p className='discountPrice'>
            {(listing.regularPrice - listing.discountedPrice)
              .toString()
              .replace(priceRegex, ',')}{' '}
            discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[
              listing.geolocation.latitude,
              listing.geolocation.longitude
            ]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[
                listing.geolocation.latitude,
                listing.geolocation.longitude
              ]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}
export default Listing;
