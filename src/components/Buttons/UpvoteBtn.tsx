import { useGetVotesQuery } from '../../redux/api';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { increment, collection, addDoc, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

type Props = {
  postId: string;
  user: User;
};

const UpvoteBtn = ({ postId, user }: Props) => {
  const { data: votes } = useGetVotesQuery();

  const isVotedByUser = votes?.find((vote) => vote.postId === postId && vote.uid === user?.uid);

  const typeOfVote = votes?.find((vote) => vote.postId === postId)?.type;

  const navigate = useNavigate();

  const vote = () => {
    if (!user) navigate('/login');
    addDoc(collection(db, 'votes'), { postId, uid: user?.uid, type: 'up' });
    updateDoc(doc(db, 'posts', postId), { voteScore: increment(1) });
  };

  const unvote = async () => {
    if (!user) navigate('/login');
    const q = query(collection(db, 'votes'), where('postId', '==', postId), where('uid', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => deleteDoc(doc.ref));
    updateDoc(doc(db, 'posts', postId), { voteScore: increment(-1) });
  };

  return (
    <div
      className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
      onClick={isVotedByUser ? unvote : vote}
    >
      <i className={`icon-arrow-up align-middle ${typeOfVote === 'up' && 'text-red-500'}`} />
    </div>
  );
};

export default UpvoteBtn;
