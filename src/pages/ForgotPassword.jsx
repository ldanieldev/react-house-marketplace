import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleOnChange = (e) => setEmail(e.target.value);
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent.');
    } catch (error) {
      console.log(error);
      toast.error('Could not send reset email.');
    }
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
        <main>
          <form onSubmit={handleOnSubmit}>
            <input
              className='emailInput'
              placeholder='Email'
              type='email'
              id='email'
              onChange={handleOnChange}
            />
            <Link className='forgotPasswordLink' to='/sign-in'>
              Sign In
            </Link>

            <div className='signInBar'>
              <div className='signInText'>
                Send Reset Link
                <button className='signInButton'>
                  <ArrowRightIcon fill='#fffff' width='34px' height='34px' />
                </button>
              </div>
            </div>
          </form>
        </main>
      </header>
    </div>
  );
}
export default ForgotPassword;
