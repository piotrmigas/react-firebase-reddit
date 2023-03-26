export interface Post {
  id: string;
  title: string;
  body: string;
  subName: string;
  avatar: string;
  username: string;
  createdAt: { seconds: number };
  voteScore: number;
  commentCount: number;
}

export interface User {
  id: string;
  displayName: string;
  avatar: string;
  createdAt: { seconds: number };
  banner: string;
  email: string;
  username: string;
  uid: string;
}

export interface Sub {
  id: string;
  createdAt: { seconds: number };
  name: string;
  title: string;
  description: string;
  avatar: string;
  banner: string;
  username: string;
  postCount: number;
}

export interface Comment {
  id: string;
  body: string;
  username: string;
  createdAt: { seconds: number };
  postId: string;
  postTitle: string;
  voteScore: number;
  subName: string;
}

export interface Vote {
  uid: string;
  type: string;
  postId: string;
  commentId: string;
}
