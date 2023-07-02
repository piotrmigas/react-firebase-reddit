import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { useGetUsersQuery } from '../redux/api';

type FormValues = {
  email: string;
  username: string;
  password: string;
  agreement: boolean;
};

const Register = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const user = useSelector(selectUser);
  const { data: users } = useGetUsersQuery();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, history]);

  const submitForm: SubmitHandler<FormValues> = ({ email, username, password }) => {
    if (users.find((user) => user.username === username)) alert('Username already taken. Please choose another one.');
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          updateProfile(user, {
            displayName: username,
          });
          setDoc(doc(db, 'users', user.uid), {
            username,
            email,
            createdAt: new Date(),
            avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
          });
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className='flex bg-white'>
      <div className='h-screen bg-center bg-cover w-36' style={{ backgroundImage: "url('./texture.jpg')" }} />
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-70'>
          <h1 className='mb-2 text-lg font-medium'>Sign Up</h1>
          <p className='mb-10 text-xs'>By continuing, you agree to our User Agreement and Privacy Policy</p>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className='mb-6'>
              <Controller
                control={control}
                name='agreement'
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <input
                    type='checkbox'
                    className='mr-1 cursor-pointer align-middle'
                    id='agreement'
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <label htmlFor='agreement' className='text-xs cursor-pointer'>
                I agree to get emails about cool stuff on Reddit
              </label>
              <small className='block font-medium text-red-600'>{errors.agreement && 'You must agree to T&Cs'}</small>
            </div>
            <div className='mb-2'>
              <input
                type='email'
                className={`${errors.email && 'border-red-500'}
           w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`}
                placeholder='EMAIL'
                {...register('email', { required: true })}
              />
              <small className='font-medium text-red-600'>{errors.email && 'This field is required'}</small>
            </div>
            <div className='mb-2'>
              <input
                className={`${errors.username && 'border-red-500'}
               w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`}
                {...register('username', { required: true })}
                placeholder='USERNAME'
              />
              <small className='font-medium text-red-600'>{errors.username && 'This field is required'}</small>
            </div>
            <div className='mb-4'>
              <input
                className={`${errors.password && 'border-red-500'}
                w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`}
                type='password'
                {...register('password', { required: true })}
                placeholder='PASSWORD'
              />
              <small className='font-medium text-red-600'>{errors.password && 'This field is required'}</small>
            </div>
            <button
              className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded focus:outline-none'
              type='submit'
            >
              Sign Up
            </button>
          </form>
          <small>
            Already a user?
            <Link to='/login' className='ml-1 text-blue-500 uppercase'>
              log in
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
