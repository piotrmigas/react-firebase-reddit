import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Comment = ({ username, createdAt, body }) => (
  <div className='flex'>
    <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'></div>
    <div className='py-2 pr-2'>
      <p className='mb-1 text-xs leading-none'>
        <Link to={`/u/${username}`} className='m-1 font-bold hover:underline'>
          {username}
        </Link>
        <span className='text-grey-600'>{` • ${dayjs(createdAt.seconds * 1000).fromNow()}`}</span>
      </p>
      <p className='ml-1'>{body}</p>
    </div>
  </div>
);

export default Comment;
