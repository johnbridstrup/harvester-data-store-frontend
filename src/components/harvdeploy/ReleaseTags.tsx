import { useState, useRef, ChangeEvent } from "react";
import { useAppDispatch } from "@/app/hooks";
import { InputFormControl } from "@/components/styled";
import useClickOutside from "@/hooks/useClickOutside";
import {
  queryReleaseTags,
  updateRelease,
} from "@/features/harvdeploy/harvdeploySlice";
import { HarvesterCodeRelease } from "@/features/harvdeploy/harvdeployTypes";
import { transformTags } from "@/utils/utils";

interface TagProps {
  release: HarvesterCodeRelease | null;
  combinedTags: Array<string>;
}

interface Tag {
  id: string;
  name: string;
  checked: boolean;
}

function ReleaseTags({ combinedTags, release }: TagProps) {
  const [fieldData, setFieldData] = useState<{
    tag: string;
    tagArr: Array<string>;
  }>({
    tag: "",
    tagArr: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const allTags = transformTags(combinedTags);
  const [tags, setTags] = useState<Array<Tag>>(allTags);

  useClickOutside(tagRef, async () => {
    setOpenModal(false);
    if (fieldData.tagArr.length > 0) {
      let data = {
        ...release?.release,
        id: release?.id,
        tags: fieldData.tagArr,
      };
      await dispatch(updateRelease(data));
    }
  });

  const handleTagClick = (tag: Tag) => {
    let index = tags.findIndex((x) => x.id === tag.id);
    let obj = tags.find((x) => x.id === tag.id);
    if (obj) {
      if (obj.checked) {
        let oldTags = [...fieldData.tagArr];
        let oldIndex = oldTags.findIndex((x) => x === obj?.name);
        oldTags.splice(oldIndex, 1);
        setFieldData((current) => {
          return { ...current, tagArr: oldTags };
        });
        obj.checked = false;
      } else {
        obj.checked = true;
        let tagData = [...fieldData.tagArr, obj.name];
        setFieldData((current) => {
          return { ...current, tagArr: tagData };
        });
      }
      let cloned = [...tags];
      cloned[index] = obj;
      setTags(cloned);
    }
  };

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
    let filtered = e.target.value
      ? allTags.filter((x) => x.name.toLowerCase().includes(e.target.value))
      : allTags;
    setTags(filtered);
    if (filtered.length === 0) {
      setCreateNew(true);
    } else {
      setCreateNew(false);
    }
  };

  const handleTagRemove = async (tag: string) => {
    let newTags: Array<string> = [];
    if (release?.tags) {
      newTags = [...release.tags];
    }
    let index = newTags.findIndex((x) => x === tag);
    newTags.splice(index, 1);
    let data = {
      ...release?.release,
      id: release?.id,
      tags: newTags,
    };
    await dispatch(updateRelease(data));
    await dispatch(queryReleaseTags());
    setTags(allTags);
  };

  const handleCreateNewTag = async () => {
    let tags: Array<string> = [];
    if (release?.tags) {
      tags = [...release.tags, fieldData.tag];
    }
    let data = {
      ...release?.release,
      id: release?.id,
      tags,
    };
    await dispatch(updateRelease(data));
    await dispatch(queryReleaseTags());
    setOpenModal(false);
    setCreateNew(false);
    setFieldData((current) => {
      return { ...current, tag: "" };
    });
    setTags(allTags);
  };

  return (
    <div className="tag-container">
      <div className="border-bottom mb-4">
        <span onClick={handleOpenModal} className="tag-color">
          Release ReleaseTags
        </span>
      </div>
      <div className="chips-wrap">
        {release?.tags?.map((x, index) => (
          <span key={index} className="text-secondary chips mx-2 mb-2">
            <span>{x}</span>{" "}
            <span className="mx-1">
              <i
                onClick={() => handleTagRemove(x)}
                className="las la-times"
              ></i>
            </span>
          </span>
        ))}
      </div>
      {openModal && (
        <div ref={tagRef} className="apply-tags">
          <div>
            <span className="apply-label-text">Apply tags to this release</span>
          </div>
          <div>
            <InputFormControl
              type="text"
              name="tag"
              value={fieldData.tag}
              onChange={handleFieldChange}
              placeholder="filter tags"
            />
          </div>
          <div className="available-tags scrollbar">
            {tags.map((x, _) => (
              <div
                key={x.id}
                onClick={() => handleTagClick(x)}
                className="text-secondary tags-name hover2"
              >
                <span>
                  {x.checked ? (
                    <i className="las la-check mx-2"></i>
                  ) : (
                    <i className="mx-2"></i>
                  )}
                  {x.name}
                </span>
                <span>{x.checked && <i className="las la-times"></i>}</span>
              </div>
            ))}
            {createNew && (
              <div
                onClick={handleCreateNewTag}
                className="text-secondary tags-name hover2 cursor"
              >
                <span className="mx-2">Create new tag "{fieldData.tag}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReleaseTags;
