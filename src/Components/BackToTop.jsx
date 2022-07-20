import { animateScroll as scroll } from "react-scroll";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function BackToTop() {
  return (
    <div
      className="backtotop"
      onClick={() => {
        scroll.scrollToTop();
      }}
    >
      <ArrowDropUpIcon sx={{ color: "white", fontSize: 40 }} />
    </div>
  );
}

export default BackToTop;
