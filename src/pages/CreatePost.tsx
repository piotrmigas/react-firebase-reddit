import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContextState } from '../context';
import { db } from '../firebase';
import { increment, addDoc, collection, updateDoc, doc } from 'firebase/firestore';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { subs, user, posts } = useContextState();

  const navigate = useNavigate();
  const { subname } = useParams<{ subname: string }>();

  const sub = subs.find((i) => i.name === subname);

  const submitPost = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    if (posts.find((post) => post.title === title)) alert('Please choose different post name.');
    else {
      addDoc(collection(db, 'posts'), {
        title,
        commentCount: 0,
        body,
        voteScore: 0,
        subName: sub?.name,
        username: user?.displayName,
        createdAt: new Date(),
        avatar: sub?.avatar,
      });
      if (sub?.id) updateDoc(doc(db, 'subs', sub.id), { postCount: increment(-1) });
      navigate('/');
    }
  };

  return (
    <div className='container flex pt-5'>
      <div className='w-160'>
        <div className='p-4 bg-white rounded'>
          <h1 className='mb-3 text-lg'>Submit a post to /r/{sub?.name}</h1>
          <form onSubmit={submitPost}>
            <div className='relative mb-2'>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none'
                placeholder='Title'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                maxLength={300}
                autoComplete='off'
              />
              <div style={{ top: 11, right: 10 }} className='absolute mb-2 text-sm text-gray-500 select-none'>
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              style={{ resize: 'none' }}
              placeholder='Text (optional)'
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded focus:outline-none'
            />
            <div className='flex justify-end'>
              <button className='blue button px-3 py-1' type='submit' disabled={title.trim().length === 0}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
};

export default CreatePost;
