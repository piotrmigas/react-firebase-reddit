import { db } from '../firebase';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { query, collection, orderBy, getDocs, where, onSnapshot } from 'firebase/firestore';

export type Comment = {
  id: string;
  body: string;
  username: string;
  createdAt: { seconds: number };
  postId: string;
  postTitle: string;
  voteScore: number;
  subName: string;
};

export const api = createApi({
  tagTypes: ['Post', 'Sub', 'Comment', 'Vote', 'User'],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPosts: builder.query<any, void>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Post'],
    }),
    getSubs: builder.query<any, void>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = onSnapshot(query(collection(db, 'subs'), orderBy('postCount', 'desc')), (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Sub'],
    }),
    getUsers: builder.query<User[], void>({
      async queryFn() {
        try {
          const usersQuery = collection(db, 'users');
          const querySnaphot = await getDocs(usersQuery);
          let users = [];
          querySnaphot?.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });

          return { data: users };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['User'],
    }),
    getComments: builder.query<any, void>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = onSnapshot(query(collection(db, 'comments')), (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Comment'],
    }),
    getVotesByPostId: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(postId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const votesQuery = query(
            collection(db, 'votes'),
            where('postId', '==', postId),
            orderBy('timestamp', 'desc')
          );
          unsubscribe = onSnapshot(votesQuery, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Vote'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSubsQuery,
  useGetUsersQuery,
  useGetCommentsQuery,
  useLazyGetVotesByPostIdQuery,
} = api;
