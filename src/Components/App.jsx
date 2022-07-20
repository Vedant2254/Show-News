import BackToTop from "./BackToTop";
import Navigation from "./Navigation";
import NewsFeed from "./NewsFeed";

function App() {
  // console.log("Rendering App");
  return (
    <div className="app">
      <Navigation />
      <NewsFeed />
      <BackToTop />
    </div>
  );
}

export default App;
