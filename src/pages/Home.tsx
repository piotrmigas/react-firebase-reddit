import { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import { useContextState, useDispatch } from '../context';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Post } from '../types';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';

dayjs.extend(relativeTime);

const Home = () => {
  const { posts, subs, authenticated } = useContextState();
  const dispatch = useDispatch();

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('voteScore', 'desc'));
    onSnapshot(
      postsQuery,
      (snap) => {
        dispatch(
          'GET_POSTS',
          snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );
    const subsQuery = query(collection(db, 'subs'), orderBy('postCount', 'desc'));
    onSnapshot(
      subsQuery,
      (snap) => {
        dispatch(
          'GET_SUBS',
          snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );
    onSnapshot(
      collection(db, 'votes'),
      (snap) => {
        dispatch(
          'GET_VOTES',
          snap.docs.map((doc) => doc.data())
        );
      },
      (error) => {
        console.log(error);
      }
    );
    const commentsQuery = query(collection(db, 'comments'), orderBy('voteScore', 'desc'));
    onSnapshot(
      commentsQuery,
      (snap) => {
        dispatch(
          'GET_COMMENTS',
          snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );
    onSnapshot(
      collection(db, 'users'),
      (snap) => {
        dispatch(
          'GET_USERS',
          snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  if (!posts.length) return <p className='text-lg text-center mt-4'>Loading..</p>;

  return (
    <div className='container flex pt-4'>
      <div className='w-full md:w-160 px-4 md:p-0'>
        {posts.map((post: Post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
      {subs.length > 0 && (
        <div className='hidden md:block ml-6 w-80'>
          <div className='bg-white rounded'>
            <div className='p-4 border-b-2'>
              <p className='text-lg font-semibold text-center'>Top Communities</p>
            </div>
            {subs.map((sub) => (
              <Link to={`/r/${sub.name}`} key={sub.id}>
                <div key={sub.id} className='flex items-center px-4 py-2 text-xs border-b'>
                  <img src={sub.avatar} className='rounded-full w-6 mr-2' alt='' />
                  <p className='font-bold'>/r/{sub.name}</p>
                  <p className='ml-auto font-med'>{sub.postCount}</p>
                </div>
              </Link>
            ))}
            {authenticated && (
              <div className='p-4 border-t-2'>
                <Link to='/subs/create' className='w-full blue button px-2 py-1'>
                  Create Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
