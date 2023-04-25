import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { A11y, Autoplay, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config.js';

function Slider() {
  const priceRegex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    <Swiper
      modules={[Pagination, A11y, Autoplay]}
      slidesPerView={1}
      a11y={false}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }}
    >
      {listings.map(({ data, id }) => (
        <SwiperSlide
          key={id}
          onClick={() => navigate(`/category/${data.type}/${id}`)}
        >
          <img
            style={{ width: '100%', height: 'auto', borderRadius: '1.5rem' }}
            src={data.imageUrls}
            alt='{listing.title}'
          />
          <p className='swiperSlideText'>{data.name}</p>
          <p className='swiperSlidePrice'>
            $
            {(data.discountedPrice ?? data.regularPrice)
              .toString()
              .replace(priceRegex, ',')}
            {data.type === 'rent' && ' / month'}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
export default Slider;
