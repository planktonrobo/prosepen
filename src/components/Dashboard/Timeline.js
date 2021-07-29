import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import {fetchMorePosts} from '../../redux/actions/posts'
const Timeline = ({following, userId}) => {
  const dispatch = useDispatch()
  const categorical = useSelector((state) => state.selectedCategory)
  const selectedCategory = categorical.selectedCategory;

  const postsByCategory = useSelector((state) => state.postsByCategory);
  

  const { isFetching, isFetchingMore, after, items: posts } = postsByCategory[
    selectedCategory
  ] || {
    isFetching: true,
    items: [],
  };

  function handleLoad(){
    if (isFetching === false && isFetchingMore === false && posts) {
    dispatch(fetchMorePosts(following, userId))
  }
  }
  return (
    <>
      {isFetching ? (
        <div className="d-flex mt-5 h-100 justify-content-center align-items-center">
          <Spinner animation="grow" />
        </div>
      ) : posts?.length > 0 ? (
        
        <InfiniteScroll
        
          loadMore={handleLoad}
          hasMore={after? true : false}
          loader={
            <div key={0} className="d-flex h-100 justify-content-center align-items-center">
              <Spinner animation="grow" />
            </div>
          }
          
        >
          
          {posts.map((content) => (

            <Post key={content.docId} selectedCategory={selectedCategory}  content={content} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="d-flex px-2 mt-5"><h6>Follow someone to fill this space up! ❤️</h6></div>
      )}
    </>
  );
};

export default Timeline;
