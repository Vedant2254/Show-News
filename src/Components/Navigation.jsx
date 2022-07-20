import NavBar from "./NavBar";
import NavForm from "./NavForm";
import { useDispatch } from "react-redux";
import { changeVisible } from "../features/form";

function Navigation() {
  // console.log("Rendering Navigation");
  const dispatch = useDispatch();

  return (
    <div
      className="navigation"
      onMouseEnter={() => {
        dispatch(changeVisible(true));
      }}
      onMouseLeave={() => {
        !document.querySelector(".navform").contains(document.activeElement) &&
          dispatch(changeVisible(false));
      }}
    >
      <NavBar />
      <NavForm />
    </div>
  );
}

export default Navigation;
