import { useEffect, useReducer } from "react";
import { useSpring, useTransition, animated } from "react-spring";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ACTIONS = {
  SET_SOURCES_VISIBLE: "set-sources-visible",
  SET_ALL_SOURCES: "set-all-sources",
  FILTER_SOURCES_INPUT: "filter-source-input",
  FILTER_SOURCES_SEARCH: "filter-source-search",
  SET_CHECKED_SOURCES: "set-checked-sources",
  CHECK_SOURCE: "check-source",
  SET_SEARCH_VAL: "set-search-val",
};

function filterSourcesInput(state, action) {
  const { country, language, category } = action.payload.filters;
  const filtered = {};
  state.sources.all.forEach((source) => {
    if (country === "" || source.country === country) {
      if (language === "" || source.language === language) {
        if (category === "" || source.category === category) {
          filtered[source.id] = source.name;
        }
      }
    }
  });

  const blankVal = state.sources.inputFiltered[""];
  state.sources.inputFiltered = {
    "":
      blankVal && blankVal !== "Loading sources...."
        ? state.sources.inputFiltered[""]
        : "All sources",
    ...filtered,
  };
  return state;
}

function filterSourcesSearch(state, action) {
  const { search } = action.payload.filters;
  const filtered = {};

  Object.entries(state.sources.inputFiltered).forEach(([key, value], _) => {
    if (value.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      filtered[key] = value;
  });

  state.sources.searchFiltered = filtered;
  return state;
}

function setCheckedSources(state, action) {
  let checked = action.payload.inputs.sources.split(",");
  const filtered = Object.keys(state.sources.inputFiltered);
  for (let i = 0; i < checked.length; i++) {
    if (!filtered.includes(checked[i])) {
      checked.splice(i, 1);
    }
  }

  const empIdx = checked.indexOf("");
  checked.length > 1 && empIdx >= 0 && checked.splice(empIdx, 1);
  return { ...state, sources: { ...state.sources, checked } };
}

function checkSource(state, action) {
  const [source] = action.payload.sources.checked;
  const idx = state.sources.checked.indexOf(source);
  if (source === "") {
    state.sourcesVisible = false;
    state.sources.checked = [""];
  }
  if (idx !== -1) {
    state.sources.checked.splice(idx, 1);
    return state;
  }
  state.sources.checked.push(source);

  const empIdx = source.indexOf("");
  empIdx > 0 && state.sources.checked.splice(empIdx, 1);
  return state;
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SEARCH_VAL:
      const { searchVal } = action.payload;
      return { ...state, searchVal };

    case ACTIONS.SET_SOURCES_VISIBLE:
      const { sourcesVisible } = action.payload;
      return { ...state, sourcesVisible };

    case ACTIONS.SET_ALL_SOURCES:
      const { all } = action.payload.sources;
      return { ...state, sources: { ...state.sources, all } };

    case ACTIONS.FILTER_SOURCES_INPUT:
      return filterSourcesInput(state, action);

    case ACTIONS.FILTER_SOURCES_SEARCH:
      return filterSourcesSearch(state, action);

    case ACTIONS.SET_CHECKED_SOURCES:
      return setCheckedSources(state, action);

    case ACTIONS.CHECK_SOURCE:
      return checkSource(state, action);

    default:
      return state;
  }
}

function SourceInput({ inputs, options, handleSourceChange, isDisabled }) {
  // console.log("Rendering SourceInput");
  const [state, dispatch] = useReducer(reducer, {
    sourcesVisible: false,
    sources: {
      all: [],
      inputFiltered: {},
      searchFiltered: {},
      checked: [],
    },
    searchVal: "",
  });
  const style = useSpring({
    from: { rotateZ: 180 },
    rotateZ: 0,
    reverse: state.sourcesVisible,
  });
  const transition = useTransition(state.sourcesVisible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 150 },
  });
  let id = 0;

  useEffect(() => {
    (async () => {
      dispatch({
        type: ACTIONS.SET_ALL_SOURCES,
        payload: { sources: { all: options } },
      });
    })().then(initHelper);
    // eslint-disable-next-line
  }, [options]);

  useEffect(initHelper, [inputs]);

  function initHelper() {
    dispatch({
      type: ACTIONS.FILTER_SOURCES_INPUT,
      payload: {
        filters: {
          country: inputs.country,
          language: inputs.language,
          category: inputs.category,
        },
      },
    });
    dispatch({
      type: ACTIONS.FILTER_SOURCES_SEARCH,
      payload: { filters: { search: state.searchVal } },
    });
    dispatch({
      type: ACTIONS.SET_CHECKED_SOURCES,
      payload: { inputs },
    });
  }

  function handleSearchInputChange(e) {
    dispatch({
      type: ACTIONS.SET_SEARCH_VAL,
      payload: { searchVal: e.target.value },
    });
    dispatch({
      type: ACTIONS.FILTER_SOURCES_SEARCH,
      payload: { filters: { search: e.target.value } },
    });
  }

  function handleCheckboxChange(e) {
    (async () => {
      dispatch({
        type: ACTIONS.CHECK_SOURCE,
        payload: { sources: { checked: [e.target.dataset.name] } },
      });
    })().then(() => {
      const val = state.sources.checked.toString();
      handleSourceChange("sources", val !== "," ? val : "");
    });
  }

  return (
    <div
      tabIndex={isDisabled ? -1 : 0}
      className={`navforminput sourceinput ${isDisabled && "disabled"}`}
      onClick={() => {
        dispatch({
          type: ACTIONS.SET_SOURCES_VISIBLE,
          payload: { sourcesVisible: !state.sourcesVisible },
        });
      }}
      onKeyDown={(e) => {
        e.key === "Escape" &&
          dispatch({
            type: ACTIONS.SET_SOURCES_VISIBLE,
            payload: { sourcesVisible: false },
          });
      }}
    >
      <p className="sourceinput-p">
        {(() => {
          let listStr = "";
          state.sources.checked.forEach((source) => {
            listStr = listStr.concat(
              `${state.sources.inputFiltered[source]}, `
            );
          });
          return listStr.slice(0, -2);
        })()}
      </p>
      {transition((style, item) =>
        item ? (
          <animated.ul style={style} className="sourceinput-ul">
            <input
              type="text"
              className="sourceinput-input"
              value={state.searchVal || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={handleSearchInputChange}
              placeholder="Search for sources"
              autoFocus
            />
            {Object.keys(state.sources.searchFiltered).map((source) => (
              <li
                className={
                  state.sources.checked.includes(source)
                    ? "sourceinput-li-checked"
                    : "sourceinput-li"
                }
                key={id++}
                data-name={source}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(e);
                }}
              >
                {state.sources.inputFiltered[source]}
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
      <div className="input-note">*Multiple selections are allowed</div>
    </div>
  );
}

export default SourceInput;
