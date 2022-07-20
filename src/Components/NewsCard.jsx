import { useSpring, animated } from "react-spring";

function NewsCard({
  author,
  description,
  publishedAt,
  source,
  title,
  url,
  urlToImage,
}) {
  // console.log("Rendering NewsCard");
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <animated.div className="newscard" id="news" style={style}>
      <a href={url} rel="noopener noreferrer" target="_blank">
        <img
          src={urlToImage}
          alt=""
          onError={(e) => {
            e.target.src = `${process.env.PUBLIC_URL}/images/404-error.png`;
          }}
          // style={{ minHeight: "300px" }}
        />
        <div className="newscontent">
          <p className="text-xl font-bold">{title}</p>
          <p className="newsdescription">
            {description}
            <small className="newspublished">
              Published at: <span id="newsPublish">{publishedAt}</span>
            </small>
          </p>
          <p>
            <span className="newssource">
              source: <span id="newsSource">{source.name}</span>
            </span>
            <span className="newsauthor">
              author: <span id="newsAuthor">{author}</span>
            </span>
          </p>
        </div>
      </a>
    </animated.div>
  );
}

export default NewsCard;
