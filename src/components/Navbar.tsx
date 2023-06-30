import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase';
import { logOut, selectUser } from '../redux/userSlice';
import { useGetSubsQuery } from '../redux/api';

const Navbar = () => {
  const user = useSelector(selectUser);

  const { data: subs } = useGetSubsQuery();

  const [name, setName] = useState('');
  const [submissions, setSubmissions] = useState<Sub[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    auth
      .signOut()
      .then(() => dispatch(logOut()))
      .catch((err) => console.log(err));
    navigate('/');
  };

  useEffect(() => {
    if (name.trim() === '') {
      setSubmissions([]);
      return;
    }
    const filtered = subs.filter((sub) => sub.name.toLowerCase().includes(name.toLowerCase()));
    setSubmissions(filtered);
  }, [name, subs]);

  const goToSub = (subName: string) => {
    navigate(`/r/${subName}`);
    setName('');
  };

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white'>
      <div className='flex items-center'>
        <Link to='/'>
          <img src='/logo.png' className='w-8 h-8 mr-2' alt='logo' />
        </Link>
        <span className='text-2xl font-semibold mb-1 hidden lg:block'>
          <Link to='/'>reddit</Link>
        </span>
      </div>
      <div className='px-4 w-160 max-w-full'>
        <div className='relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white'>
          <i className='pl-4 pr-3 text-gray-500 fas fa-search ' />
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='py-1 pr-3 bg-transparent rounded focus:outline-none'
            placeholder='Search subs...'
          />
          <div className='absolute left-0 right-0 bg-white' style={{ top: '100%' }}>
            {submissions?.map((sub) => (
              <div
                className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200'
                onClick={() => goToSub(sub.name)}
                key={sub.id}
              >
                <img className='rounded-full' src={sub.avatar} alt='' height={32} width={32} />
                <div className='text-sm ml-4'>
                  <p className='font-medium'>{sub.name}</p>
                  <p className='text-gray-600'>{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex'>
        {user ? (
          <button
            className='hidden sm:block lg:w-32 w-20 py-1 mr-4 leading-5 hollow blue button focus:outline-none'
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to='/login'
              className='hidden sm:block lg:w-32 w-20 py-1 mr-4 leading-5 hollow blue button focus:outline-none'
            >
              log in
            </Link>
            <Link to='/register' className='hidden sm:block lg:w-32 w-20 py-1 leading-5 blue button focus:outline-none'>
              sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
