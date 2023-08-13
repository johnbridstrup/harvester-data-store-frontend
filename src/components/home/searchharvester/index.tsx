import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { useAppDispatch } from "@/app/hooks";
import HomeSearch from "./HomeSearch";
import MenuSearch from "./MenuSearch";
import { THEME_MODES } from "@/features/base/constants";
import { Theme, toast } from "react-toastify";
import "./styles.css";

interface SearchProps {
  component: string;
  theme: string | null;
}

function SearchHarvester(props: SearchProps) {
  const [search, setSearch] = useState<number>(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    setSearch(value);
  };

  const handleSearch = async () => {
    const res = await dispatch(
      queryHarvester({
        harv_id: search,
      }),
    );
    if (res.payload?.count === 1) {
      let harvId = res.payload?.results[0]?.id;
      navigate(`/harvesters/${harvId}?harv_id=${search}`);
    } else {
      toast.error("searched harvester does not exist", {
        theme:
          props.theme === THEME_MODES.AUTO_THEME
            ? "colored"
            : (props.theme as Theme),
      });
    }
  };

  const Component =
    props.component === "navbar" ? (
      <MenuSearch handleChange={handleChange} handleKeyDown={handleKeyDown} />
    ) : props.component === "homepage" ? (
      <HomeSearch
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
        theme={props.theme}
      />
    ) : (
      <></>
    );

  return Component;
}

export default SearchHarvester;
