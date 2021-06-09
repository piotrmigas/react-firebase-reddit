import { useContextState } from "../../context";
import { increment, decrement, db } from "../../firebase";
import { useHistory } from "react-router-dom";

const UpvoteBtn: React.FC<{ postId: string }> = ({ postId }) => {
  const { user, votes, authenticated } = useContextState();

  const isVotedByUser = votes?.find((vote) => vote.postId === postId && vote.uid === user?.uid);

  const typeOfVote = votes?.find((vote) => vote.postId === postId)?.type;

  const history = useHistory();

  const vote = () => {
    if (!authenticated) history.push("/login");

    db.collection("votes").add({ postId, uid: user.uid, type: "up" });
    db.collection("posts").doc(postId).update({ voteScore: increment });
  };

  const unvote = () => {
    if (!authenticated) history.push("/login");

    db.collection("votes")
      .where("postId", "==", postId)
      .where("uid", "==", user.uid)
      .get()
      .then((snap) => snap.forEach((doc) => doc.ref.delete()));

    db.collection("posts").doc(postId).update({ voteScore: decrement });
  };

  return (
    <div
      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
      onClick={isVotedByUser ? unvote : vote}
    >
      <i className={`icon-arrow-up align-middle ${typeOfVote === "up" && "text-red-500"}`} />
    </div>
  );
};

export default UpvoteBtn;
