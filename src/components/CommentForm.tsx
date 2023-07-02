import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { increment, addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

type Props = {
  post: Post;
  user: User;
  subName: string;
};

const CommentForm = ({ user, post, subName }: Props) => {
  const [newComment, setNewComment] = useState('');

  const submitComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    addDoc(collection(db, 'comments'), {
      postId: post?.id,
      body: newComment,
      username: user?.displayName,
      createdAt: new Date(),
      subName,
      postTitle: post?.title,
    });

    if (post?.id) updateDoc(doc(db, 'posts', post.id), { commentCount: increment(1) });
    setNewComment('');
  };

  return (
    <div>
      <p className='mb-1 text-xs'>
        Comment as{' '}
        <Link to={`/u/${user.displayName}`} className='font-semibold text-blue-500'>
          {user.displayName}
        </Link>
      </p>
      <form onSubmit={submitComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className='w-full p-3 border bored-gray-300 rounded focus:outline-none focus:border-gray-600 resize-none'
        />
        <div className='flex justify-end'>
          <button className='px-3 py-1 blue button' disabled={newComment.trim() === ''} type='submit'>
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
