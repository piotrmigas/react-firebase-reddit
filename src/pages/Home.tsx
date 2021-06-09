import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/PostCard";
import usePageBottom from "../hooks/usePageBottom";
import usePaginatedPosts from "../hooks/usePaginatedPosts";
import { useContextState, useDispatch } from "../context";
import { Link } from "react-router-dom";
import { db } from "../firebase";

dayjs.extend(relativeTime);

const Home = () => {
  const { subs, authenticated, posts } = useContextState();
  const { loadMore, loadingMore, hasMore, loadingError } = usePaginatedPosts();
  const isPageBottom = usePageBottom();

  useEffect(() => {
    if (!isPageBottom) return;
    loadMore();
  }, [isPageBottom]);

  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("subs")
      .orderBy("postCount", "desc")
      .onSnapshot(
        (snap) => {
          dispatch(
            "GET_SUBS",
            snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        },
        (error) => {
          console.log(error);
        }
      );
    db.collection("votes").onSnapshot(
      (snap) => {
        dispatch(
          "GET_VOTES",
          snap.docs.map((doc) => doc.data())
        );
      },
      (error) => {
        console.log(error);
      }
    );
    db.collection("comments")
      .orderBy("voteScore", "desc")
      .onSnapshot(
        (snap) => {
          dispatch(
            "GET_COMMENTS",
            snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        },
        (error) => {
          console.log(error);
        }
      );
    db.collection("users").onSnapshot(
      (snap) => {
        dispatch(
          "GET_USERS",
          snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div className="container flex pt-4">
      <div className="w-full md:w-160 px-4 md:p-0">
        {!posts.length && <p className="text-lg text-center">Loading..</p>}
        {loadingError && <p className="text-lg text-center">Error fetching posts..</p>}
        {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
        {loadingMore && hasMore && <p className="text-lg text-center">Loading..</p>}
      </div>
      {subs.length > 0 && (
        <div className="hidden md:block ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">Top Communities</p>
            </div>
            {subs.map((sub) => (
              <Link to={`/r/${sub.name}`} key={sub.id}>
                <div key={sub.id} className="flex items-center px-4 py-2 text-xs border-b">
                  <img src={sub.avatar} className="rounded-full w-6 mr-2" alt="" />
                  <p className="font-bold">/r/{sub.name}</p>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              </Link>
            ))}
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link to="/subs/create" className="w-full blue button px-2 py-1">
                  Create Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
