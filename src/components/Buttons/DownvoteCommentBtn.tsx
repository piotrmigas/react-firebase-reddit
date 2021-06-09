import { useContextState } from "../../context";
import { increment, decrement, db } from "../../firebase";
import { useHistory } from "react-router-dom";
import { Vote } from "../../types";

const DownvoteCommentBtn: React.FC<{ commentId: string }> = ({ commentId }) => {
  const { user, votes, authenticated } = useContextState();

  const isVotedByUser = votes?.find((vote: Vote) => vote.commentId === commentId && vote.uid === user?.uid);

  const typeOfVote = votes?.find((vote) => vote.commentId === commentId)?.type;

  const history = useHistory();

  const vote = () => {
    if (!authenticated) history.push("/login");

    db.collection("votes").add({ commentId, uid: user.uid, type: "down" });
    db.collection("comments").doc(commentId).update({ voteScore: decrement });
  };

  const unvote = () => {
    if (!authenticated) history.push("/login");

    db.collection("votes")
      .where("commentId", "==", commentId)
      .where("uid", "==", user.uid)
      .get()
      .then((snap) => snap.forEach((doc) => doc.ref.delete()));

    db.collection("comments").doc(commentId).update({ voteScore: increment });
  };

  return (
    <div
      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
      onClick={isVotedByUser ? unvote : vote}
    >
      <i className={`icon-arrow-down align-middle ${typeOfVote === "down" && "text-blue-600"}`} />
    </div>
  );
};

export default DownvoteCommentBtn;
