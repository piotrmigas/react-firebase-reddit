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
  subName: string;
};

export const api = createApi({
  tagTypes: ['Post', 'Sub', 'Comment', 'PostVote', 'CommentVote', 'User'],
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

          unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snapshot) => {
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
    getCommentsByPostId: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(postId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          if (postId) {
            unsubscribe = onSnapshot(
              query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'desc')),
              (snapshot) => {
                updateCachedData(() => {
                  return snapshot?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                });
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Comment'],
    }),
    getUserComments: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(username, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          if (username) {
            unsubscribe = onSnapshot(
              query(collection(db, 'comments'), where('username', '==', username), orderBy('createdAt', 'desc')),
              (snapshot) => {
                updateCachedData(() => {
                  return snapshot?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                });
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Comment'],
    }),
    getUserPosts: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(username, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          if (username) {
            unsubscribe = onSnapshot(
              query(collection(db, 'posts'), where('username', '==', username), orderBy('createdAt', 'desc')),
              (snapshot) => {
                updateCachedData(() => {
                  return snapshot?.docs?.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                });
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Post'],
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
          if (postId) {
            const votesQuery = query(
              collection(db, 'votes'),
              where('postId', '==', postId),
              orderBy('createdAt', 'desc')
            );
            unsubscribe = onSnapshot(votesQuery, (snapshot) => {
              updateCachedData(() => {
                return snapshot?.docs?.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
              });
            });
          }
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['PostVote'],
    }),
    getVotesByCommentId: builder.query<any, string>({
      async queryFn() {
        return {
          data: null,
        };
      },
      async onCacheEntryAdded(commentId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          if (commentId) {
            const votesQuery = query(
              collection(db, 'votes'),
              where('commentId', '==', commentId),
              orderBy('createdAt', 'desc')
            );
            unsubscribe = onSnapshot(votesQuery, (snapshot) => {
              updateCachedData(() => {
                return snapshot?.docs?.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
              });
            });
          }
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['CommentVote'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSubsQuery,
  useGetUsersQuery,
  useGetCommentsByPostIdQuery,
  useGetUserCommentsQuery,
  useGetVotesByPostIdQuery,
  useGetUserPostsQuery,
  useGetVotesByCommentIdQuery,
} = api;
