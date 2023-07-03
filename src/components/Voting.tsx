import { useState, useEffect } from 'react';
import { useGetVotesByPostIdQuery, useGetVotesByCommentIdQuery } from '../redux/api';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

type Props = {
  postId?: string;
  commentId?: string;
  user: User;
};

export default function Voting({ postId, user, commentId }: Props) {
  const [vote, setVote] = useState<boolean>();
  const { data: votesByPostId } = useGetVotesByPostIdQuery(postId);
  const { data: votesByCommentId } = useGetVotesByCommentIdQuery(commentId);

  const navigate = useNavigate();

  useEffect(() => {
    const hasUserVoted = (postId ? votesByPostId : votesByCommentId)?.find(
      (vote: Vote) => vote.uid === user?.uid
    )?.isUpVote;
    setVote(hasUserVoted);
  }, [votesByPostId, votesByCommentId, user?.uid, postId]);

  const upVote = (isUpVote: boolean) => {
    if (!user) navigate('/login');
    if (vote && isUpVote) return;
    if (vote === false && !isUpVote) return;

    addDoc(collection(db, 'votes'), {
      ...(postId && { postId }),
      ...(commentId && { commentId }),
      uid: user?.uid,
      isUpVote,
      createdAt: serverTimestamp(),
    });
  };

  const displayVotes = () => {
    const displayNumber = (postId ? votesByPostId : votesByCommentId)?.reduce(
      (total: number, vote: Vote) => (vote.isUpVote ? (total += 1) : (total -= 1)),
      0
    );

    if ((postId ? votesByPostId : votesByCommentId)?.length === 0) return 0;
    if (displayNumber === 0) {
      return (postId ? votesByPostId : votesByCommentId)[0]?.isUpVote ? 1 : -1;
    }

    return displayNumber;
  };

  return (
    <div className='w-10 flex-shrink-0 py-2 text-center rounded-l'>
      <div
        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
        onClick={() => upVote(true)}
      >
        <i className={`icon-arrow-up align-middle ${vote && 'text-red-500'}`} />
      </div>
      <p className='text-xs font-bold'>{displayVotes()}</p>
      <div
        className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600'
        onClick={() => upVote(false)}
      >
        <i className={`icon-arrow-down align-middle ${vote === false && 'text-blue-600'}`} />
      </div>
    </div>
  );
}
