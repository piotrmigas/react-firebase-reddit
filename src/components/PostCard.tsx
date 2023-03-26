import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { slugify } from '../slugify';
import ActionBtn from './Buttons/ActionBtn';
import UpvoteBtn from './Buttons/UpvoteBtn';
import DownvoteBtn from './Buttons/DownvoteBtn';
import { Post } from '../types';
import { useContextState } from '../context';

dayjs.extend(relativeTime);

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const location = useLocation();
  const isInSubPage = location.pathname === `/r/${post.subName}`;
  const { authenticated } = useContextState();

  return (
    <div className='flex mb-4 bg-white rounded'>
      <div className='w-10 py-3 text-center bg-gray-200 rounded-l'>
        <UpvoteBtn postId={post.id} />
        <p className='text-xs font-bold'>{post.voteScore}</p>
        <DownvoteBtn postId={post.id} />
      </div>
      <div className='w-full p-2'>
        <div className='flex items-center'>
          {!isInSubPage && (
            <>
              <Link to={`/r/${post.subName}`}>
                <img src={post.avatar} className='w-6 h-6 mr-1 rounded-full' alt='' />
              </Link>
              <Link to={`/r/${post.subName}`} className='text-xs font-bold hover:underline'>
                /r/{post.subName}
              </Link>
              <span className='mx-1 text-xs text-gray-500'>•</span>
            </>
          )}
          <p className='text-xs text-gray-500'>
            Posted by
            <Link to={authenticated ? `/u/${post.username}` : '/login'} className='mx-1 hover:underline'>
              /u/{post.username}
            </Link>
            {dayjs(post.createdAt.seconds * 1000).fromNow()}
          </p>
        </div>
        <div className='w-11/12'>
          <Link
            to={`/r/${post.subName}/${post.id}/${slugify(post.title)}`}
            className='my-1 text-lg font-medium break-words'
          >
            {post.title}
          </Link>
          {post.body && <p className='my-1 text-sm'>{post.body}</p>}
        </div>
        <div className='flex'>
          <Link to={`/r/${post.subName}/${post.id}/${slugify(post.title)}`}>
            <ActionBtn>
              <i className='mr-1 fas fa-comment-alt fa-xs' />
              <span className='font-bold'>{post.commentCount} Comments</span>
            </ActionBtn>
          </Link>
          <ActionBtn>
            <i className='mr-1 fas fa-share fa-xs' />
            <span className='font-bold'>Share</span>
          </ActionBtn>
          <ActionBtn>
            <i className='mr-1 fas fa-bookmark fa-xs' />
            <span className='font-bold'>Save</span>
          </ActionBtn>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
