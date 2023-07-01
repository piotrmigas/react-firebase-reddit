import { useState, useEffect } from 'react';
import { useLazyGetVotesByPostIdQuery } from '../redux/api';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Props = {
  postId?: string;
  commentId?: string;
  user: User;
};

export default function Voting({ postId, commentId, user }: Props) {
  const [vote, setVote] = useState<boolean>();

  const [getVotesByPostId, { data }] = useLazyGetVotesByPostIdQuery();

  useEffect(() => {
    if (postId) getVotesByPostId(postId);
  }, [postId]);

  const hasUserVoted = data?.find((vote: Vote) => vote.uid === user.uid)?.isUpVote;
  const navigate = useNavigate();

  useEffect(() => {
    setVote(hasUserVoted);
  }, [data]);

  const upVote = (isUpVote: boolean) => {
    if (!user) navigate('/login');
    if (vote && isUpVote) return;
    if (vote === false && !isUpVote) return;

    addDoc(collection(db, 'votes'), { postId, uid: user?.uid, isUpVote, timestamp: serverTimestamp() });
    //updateDoc(doc(db, 'posts', postId), { voteScore: increment(isUpVote ? 1 : -1) });
    //   updateDoc(doc(db, 'comments', commentId), { voteScore: increment(isUpVote ? 1 : -1) });
  };

  const displayVotes = () => {
    const displayNumber = data?.reduce((total: number, vote: Vote) => (vote.isUpVote ? (total += 1) : (total -= 1)), 0);
    if (data?.length === 0) return 0;
    if (displayNumber === 0) {
      return data[0]?.isUpVote ? 1 : -1;
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
