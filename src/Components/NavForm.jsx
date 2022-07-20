import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTransition, animated } from "react-spring";
import { changeParams, changeVisible } from "../features/form";
import { getNews } from "../features/news";
import CustomSelect from "./CustomSelect";
import SourceInput from "./SourceInput";
import axios from "axios";

function NavForm() {
  // console.log("Rendering NavForm");
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.form);
  const [disabledInputs, setDisabledInputs] = useState([
    "type",
    "country",
    "language",
    "category",
    "sources",
  ]);
  const [options, setOptions] = useState({
    typeOpts: {},
    countryOpts: {},
    languageOpts: {},
    categoryOpts: {},
    sourceOpts: [{ id: "", name: "Loading sources...." }],
  });
  const [inputs, setInputs] = useState({
    type: "top-headlines",
    q: "",
    country: "",
    language: "",
    category: "",
    sources: "",
    from: "",
    to: "",
    sortBy: "publishedAt",
    pageSize: 20,
    page: 1,
    apiKey: process.env.REACT_APP_NEWSAPI_KEY,
  });
  const transition = useTransition(visible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 150 },
  });

  useEffect(() => {
    function getSources(opts) {
      axios
        .get("https://newsapi.org/v2/top-headlines/sources", {
          params: { apiKey: inputs.apiKey },
        })
        .then((res) => {
          setOptions({
            ...opts,
            sourceOpts: res.data.sources,
          });
          setDisabledInputs([]);
        })
        .catch((err) => {
          setOptions({
            ...opts,
            sourceOpts: [{ id: "", name: err.message }],
          });
        });
    }

    axios
      .get(process.env.PUBLIC_URL + "/options.json")
      .then((res) => {
        const opts = { ...options, ...res.data };
        setOptions({ ...options, ...res.data });
        setDisabledInputs(["sources"]);
        return opts;
      })
      .then((opts) => {
        getSources(opts);
      });

    // eslint-disable-next-line
  }, []);

  function handleInputChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    const newVal = { [key]: value ? value : "" };
    setInputs({ ...inputs, ...newVal });
  }

  function handleCustomInputChange(key, value) {
    const newVal = { [key]: value ? value : "" };
    if (["country", "language", "category"].includes(key))
      newVal["sources"] = "";
    setInputs({ ...inputs, ...newVal });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(changeVisible(false));
    dispatch(changeParams({ ...inputs }));
    dispatch(getNews({ clear: true }));
  }

  return transition((style, item) =>
    item ? (
      <animated.form className="navform" style={style} onSubmit={handleSubmit}>
        <CustomSelect
          name="type"
          options={options.typeOpts}
          currSelection={inputs.type}
          handleCustomSelect={handleCustomInputChange}
          isDisabled={disabledInputs.includes("type")}
        />
        <input
          type="text"
          name="q"
          className="navforminput"
          id="q"
          placeholder="Query"
          value={inputs.q}
          onChange={handleInputChange}
          disabled={disabledInputs.includes("q")}
        />
        <CustomSelect
          name="country"
          options={options.countryOpts}
          currSelection={inputs.country}
          handleCustomSelect={handleCustomInputChange}
          isDisabled={disabledInputs.includes("country")}
        />
        <CustomSelect
          name="language"
          options={options.languageOpts}
          currSelection={inputs.language}
          handleCustomSelect={handleCustomInputChange}
          isDisabled={disabledInputs.includes("language")}
        />
        <CustomSelect
          name="category"
          options={options.categoryOpts}
          currSelection={inputs.category}
          handleCustomSelect={handleCustomInputChange}
          isDisabled={disabledInputs.includes("category")}
        />
        <SourceInput
          name={"sources"}
          inputs={inputs}
          options={options.sourceOpts}
          handleSourceChange={handleCustomInputChange}
          isDisabled={disabledInputs.includes("sources")}
        />
        <div className="navforminput">
          <input
            type="date"
            name="from"
            className="h-full w-full"
            id="from"
            value={inputs.from}
            onChange={handleInputChange}
            disabled={disabledInputs.includes("from")}
          />
          <div className="input-note">from date</div>
        </div>
        <div className="navforminput">
          <input
            type="date"
            name="to"
            className="h-full w-full"
            id="to"
            value={inputs.to}
            onChange={handleInputChange}
            disabled={disabledInputs.includes("to")}
          />
          <div className="input-note">to date</div>
        </div>
        <CustomSelect
          name="sortBy"
          options={options.sortByOpts}
          currSelection={inputs.sortBy}
          handleCustomSelect={handleCustomInputChange}
          isDisabled={disabledInputs.includes("sortBy")}
        />

        <button>Show News</button>
      </animated.form>
    ) : (
      ""
    )
  );
}

export default NavForm;
