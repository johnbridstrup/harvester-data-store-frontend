import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryRelease } from "@/features/harvdeploy/harvdeploySlice";
import { PushStateEnum, THEME_MODES } from "@/features/base/constants";
import {
  handleSelectFactory,
  paramsToObject,
  pushState,
  selectDarkStyles,
  transformFruitOptions,
  transformTagsOptions,
} from "@/utils/utils";

function ReleaseCodeQuery() {
  const [selectedFruit, setSelectedFruit] = useState<any>(null);
  const [selectedTag, setSelectTag] = useState<any>(null);
  const { tags } = useAppSelector((state) => state.harvdeploy);
  const { fruits } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const fruitOptions = transformFruitOptions(fruits);
  const tagOptions = transformTagsOptions(tags);

  const handleFruitSelect = handleSelectFactory(setSelectedFruit);
  const handleTagSelect = handleSelectFactory(setSelectTag);

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    if (paramsObj.fruit) {
      let fruitObj = { label: paramsObj.fruit, value: paramsObj.fruit };
      setSelectedFruit(fruitObj);
    }
    if (paramsObj.tags) {
      const mapTags = paramsObj.tags.split(",").map((x: string) => {
        return { label: x, value: x };
      });
      setSelectTag(mapTags);
    }
  }, [search]);

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const queryObj: Record<string, any> = {};

    if (selectedFruit && selectedFruit.hasOwnProperty("value")) {
      queryObj["fruit"] = selectedFruit.value;
    }
    if (selectedTag && selectedTag.length > 0) {
      queryObj["tags"] = selectedTag.map((x: { value: string }) => x.value);
    }

    dispatch(queryRelease(queryObj));
    pushState(queryObj, PushStateEnum.RELEASECODE);
  };

  const customStyles = theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};

  return (
    <div>
      <form onSubmit={handleFormQuerySubmit} data-testid="query-form">
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <label htmlFor="fruit">Fruit</label>
              <Select
                isSearchable
                isClearable
                placeholder="strawberry"
                options={fruitOptions}
                name="fruit"
                inputId="fruit"
                onChange={handleFruitSelect}
                defaultValue={selectedFruit}
                value={selectedFruit}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <Select
                isSearchable
                isClearable
                isMulti
                placeholder="Invalid"
                options={tagOptions}
                name="tags"
                inputId="tags"
                onChange={handleTagSelect}
                defaultValue={selectedTag}
                value={selectedTag}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="form-group mb-4 mt-3">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default ReleaseCodeQuery;
