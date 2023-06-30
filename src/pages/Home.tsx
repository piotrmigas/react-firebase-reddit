import { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { useGetPostsQuery, useGetSubsQuery } from '../redux/api';

dayjs.extend(relativeTime);

const Home = () => {
  const user = useSelector(selectUser);

  const { data: posts, isLoading } = useGetPostsQuery();
  const { data: subs } = useGetSubsQuery();

  if (isLoading) return <p className='text-lg text-center mt-4'>Loading..</p>;

  return (
    <div className='container flex pt-4'>
      <div className='w-full md:w-160 px-4 md:p-0'>
        {posts.map((post: Post) => (
          <PostCard post={post} key={post.id} user={user} />
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
            {user && (
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
