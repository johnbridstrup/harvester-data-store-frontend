import { ChangeEvent, KeyboardEvent } from "react";
import { darkThemeClass } from "@/utils/utils";

interface HomeSearchProps {
  theme: string | null;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

function HomeSearch(props: HomeSearchProps) {
  const inputtheme = darkThemeClass("dt-input-theme", props.theme);
  const btn = darkThemeClass("btn-dark", props.theme);

  return (
    <div className={`custom-card`}>
      <div className="harv-search-heading">Search Harvester By Harv ID</div>
      <div className="harv-search">
        <div className={`search-wrap`}>
          <i className="las la-search"></i>
          <input
            name="search"
            type="number"
            id="search"
            placeholder="e.g 100"
            className={`${inputtheme}`}
            onKeyDown={props.handleKeyDown}
            onChange={props.handleChange}
            required
          />
          <span
            onClick={props.handleSearch}
            className={`btn btn-sm btn-default ${btn}`}
          >
            Search
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomeSearch;
