import { useSelector, useDispatch } from "react-redux";
import { toggleVisible } from "../features/form";
import { useSpring, animated } from "react-spring";
import SearchIcon from "@mui/icons-material/Search";

function NavBar() {
  // console.log("Rendering Navbar");
  const dispatch = useDispatch();
  const results = useSelector((state) => state.news.news.totalResults);
  const { number } = useSpring({
    from: { number: 0 },
    number: results,
  });

  return (
    <div className="navbar" onClick={() => dispatch(toggleVisible())}>
      <span>
        <SearchIcon sx={{ fontSize: 50 }} className="mr-1 -mt-1" />
        NEWS
      </span>
      <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
    </div>
  );
}

export default NavBar;
