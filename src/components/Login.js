import React from 'react';
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className='login'>
      <div className='loginheader'>
        FreshChat | Admin Login
      </div>
      <button className='loginbtn' onClick={signInWithGoogle}><FcGoogle /> &nbsp; &nbsp; Login with Google</button>
    </div>
  );
};

export default Login;
