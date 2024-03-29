import { ChangeEvent, useState, useEffect, MouseEvent } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import { Link, useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import { v4 } from 'uuid';
import { storage, db } from '../firebase';
import { slugify } from '../slugify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { useGetUsersQuery, useGetUserPostsQuery, useGetUserCommentsQuery } from '../redux/api';

dayjs.extend(relativeTime);

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const user = useSelector(selectUser);
  const { data: users } = useGetUsersQuery();
  const userProfile = users?.find((i: User) => i.username === username);

  const { data: userComments } = useGetUserCommentsQuery(userProfile?.username);
  const { data: userPosts } = useGetUserPostsQuery(userProfile?.username);

  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState('');
  const [owner, setOwner] = useState(false);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) setFile(files[0]);
  };

  useEffect(() => {
    if (!user) return;
    if (user.displayName === userProfile?.username) setOwner(true);
  }, [user, userProfile?.username]);

  const uploadImage = async () => {
    if (file) {
      const fileRef = ref(storage, `images/${v4()}.jpg`);
      const upload = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(upload.ref);
      if (userProfile) {
        updateDoc(doc(db, 'users', userProfile.id), {
          [imageType]: url,
        });
      }

      setFile(null);
      setModal(false);
    }
  };

  const handleClick = (e: MouseEvent<HTMLElement>, type: string) => {
    e.stopPropagation();
    setModal(owner && true);
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
      <div className='container flex pt-5'>
        <div className='w-160'>
          <h1 className='text-lg font-semibold pb-3'>Recent activity</h1>
          {userComments?.length > 0 && <h2 className='text-center text-md font-semibold pb-3'>Comments:</h2>}
          {userComments?.map(({ id, subName, postTitle, postId, createdAt, body }) => (
            <div className='flex my-4 bg-white rounded' key={id}>
              <div className='bg-gray-200 flex-shrink-0 w-10 py-4 text-center rounded-l flex justify-center items-center'>
                <i className='fas fa-comment-alt fa-xs text-gray-500' />
              </div>
              <div className='w-full p-2'>
                <p className='mb-2 text-xs text-gray-500'>
                  {userProfile?.username}
                  <span> commented on </span>
                  <Link to={`/r/${subName}/${postId}/${slugify(postTitle)}`} className='font-semibold hover:underline'>
                    {postTitle}
                  </Link>{' '}
                  {dayjs(createdAt.seconds * 1000).fromNow()}
                  <span className='mx-1'>•</span>
                  <Link to={`/r/${subName}`} className='hover:underline'>
                    /r/{subName}
                  </Link>
                </p>
                <hr />
                <p>{body}</p>
              </div>
            </div>
          ))}
          {userPosts?.length > 0 && <h2 className='text-center text-md font-semibold pb-3'>Posts:</h2>}
          {userPosts?.map((post: Post) => (
            <PostCard key={post.id} post={post} user={user} />
          ))}
        </div>
        <div className='w-80 ml-6'>
          <div className='bg-white rounded'>
            {userProfile?.banner ? (
              <div
                className={`rounded-t p-3 ${owner && 'cursor-pointer'}`}
                style={{
                  backgroundImage: `url(${userProfile.banner})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={(e) => {
                  handleClick(e, 'banner');
                }}
              >
                <img
                  src={userProfile.avatar}
                  className={`w-16 h-16 mx-auto border-2 border-white rounded-full ${owner && 'cursor-pointer'}`}
                  alt=''
                  onClick={(e) => {
                    handleClick(e, 'avatar');
                  }}
                />
              </div>
            ) : (
              <div
                className={`bg-blue-500 rounded-t p-3 ${owner && 'cursor-pointer'}`}
                onClick={(e) => {
                  handleClick(e, 'banner');
                }}
              >
                <img
                  src={userProfile?.avatar}
                  className={`w-16 h-16 mx-auto border-2 border-white rounded-full ${owner && 'cursor-pointer'}`}
                  alt=''
                  onClick={(e) => {
                    handleClick(e, 'avatar');
                  }}
                />
              </div>
            )}
            <div className='p-3 text-center'>
              <h1 className='mb-3 text-xl text-center'>{userProfile?.username}</h1>
              <hr />
              <p className='mt-3'>
                Joined {userProfile && dayjs(userProfile.createdAt.seconds * 1000).format('MMM YYYY')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
