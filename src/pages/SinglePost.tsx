import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Sidebar from '../components/Sidebar';
import { useContextState } from '../context';
import ActionBtn from '../components/Buttons/ActionBtn';
import UpvoteBtn from '../components/Buttons/UpvoteBtn';
import DownvoteBtn from '../components/Buttons/DownvoteBtn';
import { slugify } from '../slugify';
import { db } from '../firebase';
import Comments from '../components/Comments';
import CommentForm from '../components/CommentForm';
import { increment, addDoc, collection, updateDoc, doc } from 'firebase/firestore';

dayjs.extend(relativeTime);

const SinglePost = () => {
  const { subname, postname } = useParams<{ postname: string; subname: string }>();
  const { subs, user, authenticated, comments, posts } = useContextState();
  const [newComment, setNewComment] = useState('');

  const sub = subs.find((i) => i.name === subname);
  const post = posts.find((post) => slugify(post.title) === postname);
  const postComments = comments?.filter((i) => i.postId === post?.id);

  const submitComment = (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    addDoc(collection(db, 'comments'), {
      postId: post?.id,
      body: newComment,
      username: user?.displayName,
      createdAt: new Date(),
      voteScore: 0,
      subName: sub?.name,
      postTitle: post?.title,
    });

    if (post?.id) updateDoc(doc(db, 'posts', post.id), { commentCount: increment(1) });
    setNewComment('');
  };

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
              <div className='flex'>
                <div className='w-10 flex-shrink-0 py-2 text-center rounded-l'>
                  <UpvoteBtn postId={post.id} />
                  <p className='text-xs font-bold'>{post.voteScore}</p>
                  <DownvoteBtn postId={post.id} />
                </div>
                <div className='py-2 pr-2'>
                  <div className='flex items-center'>
                    <p className='text-xs text-gray-500'>
                      Posted by
                      <Link to={authenticated ? `/u/${post.username}` : '/login'} className='mx-1 hover:underline'>
                        /u/{post.username}
                      </Link>
                      {dayjs(post.createdAt.seconds * 1000).fromNow()}
                    </p>
                  </div>
                  <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                  <p className='my-3 text-sm'>{post.body}</p>
                  <div className='flex'>
                    <ActionBtn>
                      <i className='mr-1 fas fa-comment-alt fa-xs' />
                      <span className='font-bold'>{post.commentCount} Comments</span>
                    </ActionBtn>
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
              <div className='pl-10 pr-6 mb-4'>
                {authenticated && user ? (
                  <CommentForm
                    setNewComment={setNewComment}
                    submitComment={submitComment}
                    user={user}
                    newComment={newComment}
                  />
                ) : (
                  <div className='justify-between flex items-center px-2 py-4 border rounded border-gray-400'>
                    <p className='text-gray-500 font-semibold'>Log in or sign up to leave a comment</p>
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
              <Comments postComments={postComments} />
            </div>
          </div>
        )}
        {sub && <Sidebar sub={sub} />}
      </div>
    </>
  );
};

export default SinglePost;
