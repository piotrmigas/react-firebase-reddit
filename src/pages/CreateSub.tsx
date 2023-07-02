import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { db } from '../firebase';
import { useGetSubsQuery } from '../redux/api';
import { addDoc, collection } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';

type FormValues = {
  title: string;
  description: string;
  name: string;
};

const CreateSub = () => {
  const user = useSelector(selectUser);
  const { data: subs } = useGetSubsQuery();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();

  const submitForm: SubmitHandler<FormValues> = ({ title, description, name }) => {
    if (subs.find((sub: Sub) => sub.name === name)) alert('Sub already exists. Please choose another name.');
    else {
      addDoc(collection(db, 'subs'), {
        title,
        description,
        avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        banner: '',
        name,
        username: user?.displayName,
        createdAt: new Date(),
        postCount: 0,
      });
      navigate(`/r/${name}`);
    }
  };

  return (
    <div className='flex bg-white'>
      <div className='h-screen bg-center bg-cover w-36' style={{ backgroundImage: "url('/texture.jpg')" }} />
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-98'>
          <h1 className='mb-2 text-lg font-medium'>Create a Community</h1>
          <hr />
          <form onSubmit={handleSubmit(submitForm)}>
            <div className='my-6'>
              <p className='font-medium'>Name</p>
              <p className='mb-2 text-xs text-gray-500'>Community names including capitalization cannot be changed.</p>
              <input
                {...register('name', { required: true })}
                className={`w-full border border-gray-200 rounded p-3 focus:outline-none hover:border-gray-500 ${
                  errors.name && 'border-red-600'
                }`}
                autoComplete='off'
              />
              {errors.name && <small className='font-medium text-red-600'>This field is required</small>}
            </div>
            <div className='my-6'>
              <p className='font-medium'>Title</p>
              <p className='mb-2 text-xs text-gray-500'>
                Community title represent the topic and you can change it at any time.
              </p>
              <input
                {...register('title', { required: true })}
                className={`w-full border border-gray-200 rounded focus:outline-none p-3 hover:border-gray-500 ${
                  errors.title && 'border-red-600'
                }`}
                autoComplete='off'
              />
              {errors.title && <small className='font-medium text-red-600'>This field is required</small>}
            </div>
            <div className='my-6'>
              <p className='font-medium'>Description</p>
              <p className='mb-2 text-xs text-gray-500'>This is how new members come to understand your community.</p>
              <textarea
                style={{ resize: 'none' }}
                {...register('description', { required: true })}
                className={`w-full border border-gray-200 rounded p-3 focus:outline-none hover:border-gray-500 ${
                  errors.description && 'border-red-600'
                }`}
              />
              {errors.description && <small className='font-medium text-red-600'>This field is required</small>}
            </div>
            <div className='flex justify-end'>
              <button type='submit' className='blue button px-4 py-1 capitalize text-sm font-semibold'>
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSub;
