import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { slugify } from '../slugify';
import ActionBtn from './ActionBtn';
import Voting from './Voting';

dayjs.extend(relativeTime);

type Props = {
  post: Post;
  user: User;
};

const PostCard = ({ post, user }: Props) => {
  const location = useLocation();
  const isInSubPage = location.pathname === `/r/${post.subName}`;

  return (
    <div className='flex mb-4 bg-white rounded'>
      <Voting user={user} postId={post.id} />
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
            <Link to={user ? `/u/${post.username}` : '/login'} className='mx-1 hover:underline'>
              /u/{post.username}
            </Link>
            {dayjs(post.createdAt.seconds * 1000).fromNow()}
          </p>
        </div>
        <div className='w-11/12'>
          <Link
            to={`/r/${post.subName}/${post.id}/${slugify(post.title)}`}
            className='my-1 text-lg font-medium break-all'
          >
            {post.title}
          </Link>
          {post.body && post.body.includes('https') ? (
            <a href={post.body} className='text-blue-500'>
              {post.body}
            </a>
          ) : (
            <p className='my-1 text-sm'>{post.body}</p>
          )}
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
