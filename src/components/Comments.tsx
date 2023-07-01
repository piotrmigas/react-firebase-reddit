import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Comment } from '../redux/api';
import Voting from './Voting';

dayjs.extend(relativeTime);

type Props = {
  postComments: Comment[];
  user: User;
};

const Comments = ({ postComments, user }: Props) => (
  <>
    {postComments.map(({ id, username, voteScore, createdAt, body }) => (
      <div className='flex' key={id}>
        <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
          <Voting commentId={id} user={user} />
        </div>
        <div className='py-2 pr-2'>
          <p className='mb-1 text-xs leading-none'>
            <Link to={`/u/${username}`} className='m-1 font-bold hover:underline'>
              {username}
            </Link>
            <span className='text-grey-600'>{`${voteScore} points • ${dayjs(
              createdAt.seconds * 1000
            ).fromNow()}`}</span>
          </p>
          <p>{body}</p>
        </div>
      </div>
    ))}
  </>
);

export default Comments;
