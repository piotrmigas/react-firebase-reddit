import { useEffect } from "react";
import usePagination from "firestore-pagination-hook";
import { useDispatch } from "../context";
import { db } from "../firebase";

export default function usePaginatedPosts() {
  const { items, loadMore, loadingMore, loading, loadingError, hasMore } = usePagination(
    db.collection("posts").orderBy("voteScore", "desc"),
    {
      limit: 5,
    }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      "GET_POSTS",
      items.map((item) => ({
        ...item.data(),
        id: item.id,
      }))
    );
  }, [items]);

  return { loadMore, loadingMore, loading, loadingError, items, hasMore };
}
