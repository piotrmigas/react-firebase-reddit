import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import { useContextState } from "../context";
import { storage, db } from "../firebase";
import Modal from "../components/Modal";

const Sub = () => {
  const { subname } = useParams<{ subname: string }>();
  const [ownSub, setOwnSub] = useState(false);
  const [imageType, setImageType] = useState("");
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<any>(null);

  const { authenticated, user, subs, posts } = useContextState();

  const sub = subs.find((i) => i.name === subname);
  const subPosts = posts.filter((i) => i.subName === sub?.name);

  useEffect(() => {
    if (!sub) return;
    if (authenticated && user.displayName === sub.username) setOwnSub(true);
  }, [sub, authenticated, user.displayName]);

  const handleUpload = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    const fileRef = storage.ref().child(`images/${v4()}.jpg`);
    await fileRef.put(file);
    const url = await fileRef.getDownloadURL();

    db.doc(`subs/${sub?.id}`).update({
      [imageType]: url,
    });

    if (imageType === "avatar") {
      db.collection("posts")
        .where("subName", "==", sub?.name)
        .get()
        .then((snap) => snap.forEach((doc) => db.collection("posts").doc(doc.id).update({ avatar: url })));
    }

    setFile(null);
    setModal(false);
  };

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading..</p>;
  } else if (subPosts.length === 0) {
    postsMarkup = <p className="text-lg text-center">No posts submitted yet</p>;
  } else {
    postsMarkup = subPosts
      .sort((a, b) => b.voteScore - a.voteScore)
      .map((post) => <PostCard key={post.id} post={post} />);
  }

  const handleClick = (type: string) => {
    setModal(ownSub && true);
    setImageType(type);
  };

  return (
    <>
      {modal && (
        <Modal
          closeModal={() => setModal(false)}
          handleUpload={handleUpload}
          uploadImage={uploadImage}
          imageType={imageType}
        />
      )}
      {sub && (
        <>
          <div>
            <div
              className={`bg-blue-500 ${ownSub && "cursor-pointer"}`}
              onClick={() => {
                handleClick("banner");
              }}
            >
              {sub.banner ? (
                <div
                  className="h-20"
                  style={{
                    backgroundImage: `url(${sub.banner})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div className="h-20 bg-blue-500" />
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <img
                    src={sub.avatar}
                    alt=""
                    className={`rounded-full ${ownSub && "cursor-pointer"}`}
                    width={80}
                    height={80}
                    onClick={() => handleClick("avatar")}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">/r/{sub.name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container flex pt-5">
            <div className="w-160">{postsMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default Sub;
