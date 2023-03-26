import { ChangeEvent, FormEvent, Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

type CommentFormProps = {
  newComment: string;
  setNewComment: Dispatch<string>;
  submitComment: (e: FormEvent) => void;
  user: User;
};

const CommentForm = ({ newComment, setNewComment, submitComment, user }: CommentFormProps) => {
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
          onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => setNewComment(e.target.value)}
          className='w-full p-3 border bored-gray-300 rounded focus:outline-none focus:border-gray-600'
          style={{ resize: 'none' }}
        />
        <div className='flex justify-end'>
          <button className='px-3 py-1 blue button' disabled={newComment.trim() === ''}>
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
