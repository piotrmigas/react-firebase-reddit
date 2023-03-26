import { useContextState } from '../../context';
import { increment, collection, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Vote } from '../../types';

export type VoteCommentBtnProps = {
  commentId: string;
};

const DownvoteCommentBtn = ({ commentId }: VoteCommentBtnProps) => {
  const { user, votes, authenticated } = useContextState();

  const isVotedByUser = votes?.find((vote: Vote) => vote.commentId === commentId && vote.uid === user?.uid);

  const typeOfVote = votes?.find((vote) => vote.commentId === commentId)?.type;

  const navigate = useNavigate();

  const vote = () => {
    if (!authenticated) navigate('/login');
    addDoc(collection(db, 'votes'), { commentId, uid: user?.uid, type: 'down' });
    updateDoc(doc(db, 'comments', commentId), { voteScore: increment(-1) });
  };

  const unvote = async () => {
    if (!authenticated) navigate('/login');
    const q = query(collection(db, 'votes'), where('commentId', '==', commentId), where('uid', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => deleteDoc(doc.ref));
    updateDoc(doc(db, 'comments', commentId), { voteScore: increment(1) });
  };

  return (
    <div
      className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600'
      onClick={isVotedByUser ? unvote : vote}
    >
      <i className={`icon-arrow-down align-middle ${typeOfVote === 'down' && 'text-blue-600'}`} />
    </div>
  );
};

export default DownvoteCommentBtn;
