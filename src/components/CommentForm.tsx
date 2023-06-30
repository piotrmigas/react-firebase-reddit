import { FormEvent } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  newComment: string;
  setNewComment: (value: string) => void;
  submitComment: (e: FormEvent<HTMLFormElement>) => void;
  user: User;
};

const CommentForm = ({ newComment, setNewComment, submitComment, user }: Props) => {
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
