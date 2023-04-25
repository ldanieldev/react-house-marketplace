import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
import { db } from '../firebase.config.js';

function OAuth() {
  const navigate = useNavigate(),
    location = useLocation();

  const onGoogleClick = async () => {
    try {
      //sign up with google oauth
      const auth = getAuth(),
        provider = new GoogleAuthProvider();

      //prompt if multiple account
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider),
        user = result.user;

      //check for user in firestore
      const docRef = doc(db, 'users', user.uid),
        docSnapshot = await getDoc(docRef);

      //create user if not exist
      if (!docSnapshot.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        });
      }

      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('could now authorize with google.');
    }
  };

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='google' />
      </button>
    </div>
  );
}
export default OAuth;
