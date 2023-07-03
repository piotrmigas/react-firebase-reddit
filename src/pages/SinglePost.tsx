import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Sidebar from '../components/Sidebar';
import { slugify } from '../slugify';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import {
  Comment as CommentType,
  useGetPostsQuery,
  useGetSubsQuery,
  useLazyGetCommentsByPostIdQuery,
} from '../redux/api';
import PostCard from '../components/PostCard';

dayjs.extend(relativeTime);

const SinglePost = () => {
  const { subname, postname } = useParams<{ postname: string; subname: string }>();
  const { data: posts } = useGetPostsQuery();
  const post = posts?.find((post: Post) => slugify(post.title) === postname);
  const { data: subs } = useGetSubsQuery();
  const [getCommentsByPostId, { data: postComments }] = useLazyGetCommentsByPostIdQuery();
  const user = useSelector(selectUser);

  const sub = subs?.find((i: Sub) => i.name === subname);

  useEffect(() => {
    if (post?.id) getCommentsByPostId(post.id);
  }, [post?.id]);

  return (
    <>
      {sub && (
        <Link to={`/r/${sub.name}`}>
          <div className='flex items-center w-full h-20 p-8 bg-blue-500'>
            <div className='container flex'>
              <div className='w-8 h-8 mr-2 overflow-hidden rounded-full'>
                <img src={sub.avatar} height={32} width={32} alt='' />
              </div>
              <p className='text-xl font-semibold text-white'>/r/{sub.name}</p>
            </div>
          </div>
        </Link>
      )}
      <div className='container flex pt-5'>
        {post && (
          <div className='w-160'>
            <div className='bg-white rounded'>
              <PostCard user={user} post={post} />
              <div className='pl-10 pr-6 mb-4'>
                {user ? (
                  <CommentForm post={post} user={user} subName={sub?.name} />
                ) : (
                  <div className='justify-between gap-1 flex flex-col lg:flex-row items-center px-2 py-4 border rounded border-gray-400'>
                    <div className='text-gray-500 font-semibold'>Log in or sign up to leave a comment</div>
                    <div>
                      <Link to='/login' className='px-4 py-1 hollow blue button mr-4'>
                        Login
                      </Link>
                      <Link to='/login' className='px-4 py-1 blue button'>
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <hr />
              {postComments?.map((comment: CommentType) => (
                <Comment key={comment.id} {...comment} />
              ))}
            </div>
          </div>
        )}
        {sub && <Sidebar sub={sub} user={user} />}
      </div>
    </>
  );
};

export default SinglePost;
