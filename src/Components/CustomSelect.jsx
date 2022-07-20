import { useEffect, useReducer } from "react";
import { useSpring, useTransition, animated } from "react-spring";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ACTIONS = {
  SET_OPTIONS_VISIBLE: "set-options-visible",
  SET_OPTIONS: "set-options",
  FILTER_OPTIONS: "filter-options",
  CHANGE_DISPSELECTION: "change-dispselection",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_OPTIONS_VISIBLE:
      const { optionsVisible } = action.payload;
      return { ...state, optionsVisible };

    case ACTIONS.SET_OPTIONS:
      const { options: opts } = action.payload;
      return { ...state, options: opts };

    case ACTIONS.FILTER_OPTIONS:
      let { options, filter } = action.payload;
      filter = filter.toLowerCase();
      Object.keys(options).forEach((key) => {
        if (options[key].toLowerCase().indexOf(filter) === -1)
          delete options[key];
      });
      return { ...state, options };

    case ACTIONS.CHANGE_DISPSELECTION:
      const { dispSelection } = action.payload;
      return { ...state, dispSelection };

    default:
      return state;
  }
}

function CustomSelect({
  name,
  options,
  currSelection,
  handleCustomSelect,
  isDisabled,
}) {
  // console.log("Rendering CustomSelect");
  const [state, dispatch] = useReducer(reducer, {
    optionsVisible: false,
    options: {},
    dispSelection: "",
  });
  const style = useSpring({
    from: { rotateZ: 180 },
    rotateZ: 0,
    reverse: state.optionsVisible,
  });
  const transition = useTransition(state.optionsVisible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 150 },
  });
  let id = 0;

  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_OPTIONS,
      payload: { options },
    });

    const dispSelectionVal = options && options[currSelection];
    dispatch({
      type: ACTIONS.CHANGE_DISPSELECTION,
      payload: {
        dispSelection: dispSelectionVal || "Loading...",
      },
    });

    // eslint-disable-next-line
  }, [options]);

  function handleInputChange(e) {
    dispatch({
      type: ACTIONS.CHANGE_DISPSELECTION,
      payload: { dispSelection: e.target.value },
    });
    dispatch({
      type: ACTIONS.SET_OPTIONS_VISIBLE,
      payload: { optionsVisible: true },
    });
    dispatch({
      type: ACTIONS.FILTER_OPTIONS,
      payload: { options: { ...options }, filter: e.target.value },
    });
  }

  function handleOptionClick(e) {
    handleCustomSelect(e.target.dataset.name, e.target.dataset.value);
    dispatch({
      type: ACTIONS.CHANGE_DISPSELECTION,
      payload: { dispSelection: options[e.target.dataset.value] },
    });
  }

  return (
    <div
      tabIndex={isDisabled ? -1 : 0}
      className={`navforminput customselect ${isDisabled && "disabled"}`}
      onClick={() => {
        dispatch({
          type: ACTIONS.SET_OPTIONS_VISIBLE,
          payload: { optionsVisible: !state.optionsVisible },
        });
      }}
    >
      <input
        tabIndex={-1}
        type="text"
        value={state.dispSelection}
        className="customselect-input"
        onChange={handleInputChange}
        placeholder={`Search for ${name}`}
        onKeyDown={(e) => {
          if (e.key === "Escape")
            dispatch({
              type: ACTIONS.SET_OPTIONS_VISIBLE,
              payload: { optionsVisible: false },
            });
        }}
        disabled={isDisabled}
      />
      {transition((style, item) =>
        item ? (
          <animated.ul style={style} className="customselect-ul">
            {Object.keys(state.options).map((opt) => (
              <li
                className="customselect-li"
                key={id++}
                onClick={handleOptionClick}
                data-name={name}
                data-value={opt}
              >
                {options[opt]}
              </li>
            ))}
          </animated.ul>
        ) : (
          ""
        )
      )}
      <animated.div className="ddarrow" style={style}>
        <ArrowDropDownIcon
          className="pushtocenter"
          sx={{ color: isDisabled ? "#b1a3af" : "#6d28d9", fontSize: 32 }}
        />
      </animated.div>
    </div>
  );
}

export default CustomSelect;
