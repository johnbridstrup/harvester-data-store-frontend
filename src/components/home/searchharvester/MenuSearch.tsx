import { ChangeEvent, KeyboardEvent } from "react";

interface MenuSearchProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

function MenuSearch(props: MenuSearchProps) {
  return (
    <>
      <div className="all-menu-group-header">Go To</div>
      <div className="all-menu-search mb-3">
        <i className="las la-search"></i>
        <input
          type="number"
          name="search"
          placeholder="Search Harvester By (harvId)"
          onChange={props.handleChange}
          onKeyDown={props.handleKeyDown}
        />
      </div>
    </>
  );
}

export default MenuSearch;
