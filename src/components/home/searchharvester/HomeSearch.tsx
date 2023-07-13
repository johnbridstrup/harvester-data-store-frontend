import { ChangeEvent, KeyboardEvent } from "react";
import { darkThemeClass } from "@/utils/utils";

interface HomeSearchProps {
  theme: string | null;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

function HomeSearch(props: HomeSearchProps) {
  const cardtheme = darkThemeClass("dt-card-theme", props.theme);
  const searchwrap = darkThemeClass("dt-search-wrap", props.theme);
  const inputtheme = darkThemeClass("dt-input-theme", props.theme);
  const spandark = darkThemeClass("dt-span-dark", props.theme);

  return (
    <div className={`card card-body mb-4 ${cardtheme}`}>
      <div className="harv-search-heading">Search Harvester By Harv ID</div>
      <div className="harv-search">
        <div className={`search-wrap ${searchwrap}`}>
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
          <span onClick={props.handleSearch} className={`${spandark}`}>
            Search
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomeSearch;
