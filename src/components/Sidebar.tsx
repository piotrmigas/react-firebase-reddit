import dayjs from 'dayjs';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  sub: Sub;
  user: User;
};

const Sidebar = ({ sub, user }: Props) => {
  const location = useLocation();

  return (
    <div className='ml-6 w-80'>
      <div className='bg-white rounded'>
        <div className='p-3 bg-blue-500 rounded-t'>
          <p className='font-semibold text-white'>About Community</p>
        </div>
        <div className='p-3'>
          <p className='mb-3 text-md'>{sub.description}</p>
          <div className='flex mb-3 text-sm font-medium'>
            <div className='w-1/2'>
              <p>5.2k</p>
              <p>members</p>
            </div>
            <div className='w-1/2'>
              <p>50</p>
              <p>online</p>
            </div>
          </div>
          <p className='my-3'>
            <i className='fas fa-birthday-cake mr-2' />
            Created {dayjs(sub.createdAt.seconds * 1000).format('D/MM/YYYY')}
          </p>
          {user && location.pathname !== `/r/${sub.name}/submit` && (
            <Link to={`/r/${sub.name}/submit`} className='text-sm py-1 w-full blue button'>
              Create Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
