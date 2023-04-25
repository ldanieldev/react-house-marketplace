import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase.config.js';

function Contact() {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Landlord data not found');
      }
    };

    getLandlord();
  }, [params.landlordId]);

  return (
    <div className='pageContainer'>
      <header className='pageHeader'>Contact Landlord</header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}
export default Contact;
