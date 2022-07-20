import NewsCard from "./NewsCard";
import { useSelector, useDispatch } from "react-redux";
import { changeVisible, changePage } from "../features/form";
import { getNews } from "../features/news";
import Masonry from "react-masonry-css";
import NewspaperIcon from "@mui/icons-material/Newspaper";

function NewsFeed() {
  // console.log("Rendering NewsFeed");
  const dispatch = useDispatch();
  const news = useSelector((state) => state.news);
  let id = 0;

  return (
    <div
      className="newsfeed"
      onClick={() => {
        dispatch(changeVisible(false));
      }}
    >
      {news.status === "idle" && (
        <div className="newsfeedmessage">
          Hover over to Navigation bar to search for news
        </div>
      )}
      {news.status === "loading" && (
        <div className="pushtocenter">
          <NewspaperIcon
            className="animate-ping"
            sx={{ fontSize: 50, color: "#6d28d9" }}
          />
        </div>
      )}
      {news.status === "failure" && (
        <div className="newsfeedmessage">{news.error}</div>
      )}
      <Masonry
        breakpointCols={3}
        className="news-masonry"
        columnClassName="news-masonry-column"
      >
        {news.status === "success" &&
          news.news.articles.length > 0 &&
          news.news.articles.map((item) => {
            return <NewsCard key={id++} {...item} />;
          })}
      </Masonry>
      {news.status === "success" && (
        <button
          className="loadmorebtn"
          onClick={() => {
            dispatch(changePage());
            dispatch(getNews({ clear: false }));
          }}
          disabled={
            news.news.articles.length === news.news.totalResults ? true : false
          }
        >
          {news.news.articles.length === news.news.totalResults
            ? "No more results!"
            : "Load more"}
        </button>
      )}
    </div>
  );
}

export default NewsFeed;
