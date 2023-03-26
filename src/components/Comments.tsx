import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import UpvoteCommentBtn from './Buttons/UpvoteCommentBtn';
import DownvoteCommentBtn from './Buttons/DownvoteCommentBtn';
import { Comment } from '../types';

dayjs.extend(relativeTime);

type CommentProps = {
  postComments: Comment[];
};

const Comments = ({ postComments }: CommentProps) => (
  <>
    {postComments.map(({ id, username, voteScore, createdAt, body }) => (
      <div className='flex' key={id}>
        <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
          <UpvoteCommentBtn commentId={id} />
          <p className='text-xs font-bold'>{voteScore}</p>
          <DownvoteCommentBtn commentId={id} />
        </div>
        <div className='py-2 pr-2'>
          <p className='mb-1 text-xs leading-none'>
            <Link to={`/u/${username}`} className='m-1 font-bold hover:underline'>
              {username}
            </Link>
            <span className='text-grey-600'>{`${voteScore} points • ${dayjs(
              createdAt.seconds * 1000
            ).fromNow()} `}</span>
          </p>
          <p>{body}</p>
        </div>
      </div>
    ))}
  </>
);

export default Comments;
