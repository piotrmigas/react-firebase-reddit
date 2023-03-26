import { ChangeEvent, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { useContextState } from '../context';
import { storage, db } from '../firebase';
import Modal from '../components/Modal';
import { updateDoc, doc, query, where, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Sub = () => {
  const { subname } = useParams<{ subname: string }>();
  const [ownSub, setOwnSub] = useState(false);
  const [imageType, setImageType] = useState('');
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { authenticated, user, subs, posts } = useContextState();

  const sub = subs.find((i) => i.name === subname);
  const subPosts = posts.filter((i) => i.subName === sub?.name);

  useEffect(() => {
    if (!sub) return;
    if (authenticated && user?.displayName === sub.username) setOwnSub(true);
  }, [sub, authenticated, user?.displayName]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) setFile(files[0]);
  };

  const uploadImage = async () => {
    if (file) {
      const fileRef = ref(storage, `images/${v4()}.jpg`);
      const upload = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(upload.ref);

      if (sub) {
        updateDoc(doc(db, 'subs', sub.id), {
          [imageType]: url,
        });
      }

      if (imageType === 'avatar') {
        const q = query(collection(db, 'posts'), where('subName', '==', sub?.name));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => updateDoc(doc(db, 'posts', document.id), { avatar: url }));
      }

      setFile(null);
      setModal(false);
    }
  };

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className='text-lg text-center'>Loading..</p>;
  } else if (subPosts.length === 0) {
    postsMarkup = <p className='text-lg text-center'>No posts submitted yet</p>;
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
              className={`bg-blue-500 ${ownSub && 'cursor-pointer'}`}
              onClick={() => {
                handleClick('banner');
              }}
            >
              {sub.banner ? (
                <div
                  className='h-20'
                  style={{
                    backgroundImage: `url(${sub.banner})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ) : (
                <div className='h-20 bg-blue-500' />
              )}
            </div>
            <div className='h-20 bg-white'>
              <div className='container relative flex'>
                <div className='absolute' style={{ top: -15 }}>
                  <img
                    src={sub.avatar}
                    alt=''
                    className={`rounded-full ${ownSub && 'cursor-pointer'}`}
                    width={80}
                    height={80}
                    onClick={() => handleClick('avatar')}
                  />
                </div>
                <div className='pt-1 pl-24'>
                  <div className='flex items-center'>
                    <h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
                  </div>
                  <p className='text-sm font-bold text-gray-500'>/r/{sub.name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='container flex pt-5'>
            <div className='w-160'>{postsMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default Sub;
