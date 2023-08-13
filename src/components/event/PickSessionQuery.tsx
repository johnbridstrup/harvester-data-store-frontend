import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryPickSession } from "@/features/event/eventSlice";
import { FormQuery } from "./EventHelpers";
import {
  handleSelectFactory,
  paramsToObject,
  pushState,
  transformHarvOptions,
  transformLocOptions,
  timeStampFormat,
  extractDateFromString,
  translateHarvOptions,
  translateLocOptions,
} from "@/utils/utils";
import { PushStateEnum } from "@/features/base/constants";

interface QueryData {
  uuid: string;
  start_time: string;
  end_time: string;
}

function PickSessionQuery() {
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [fieldData, setFieldData] = useState<QueryData>({
    uuid: "",
    start_time: "",
    end_time: "",
  });
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const { tags } = useAppSelector((state) => state.event);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const harvesterOptions = transformHarvOptions(harvesters);
  const locationOptions = transformLocOptions(locations);
  const tagOptions = tags.map((x) => {
    return { label: x, value: x };
  });

  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleTagSelect = handleSelectFactory(setSelectedTag);

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    if (paramsObj.harv_ids) {
      let harv_ids = paramsObj.harv_ids.split(",").map((harv_id: string) => {
        return { value: Number(harv_id), label: Number(harv_id) };
      });
      setSelectedHarvId(harv_ids);
    }
    if (paramsObj.locations) {
      let locations = paramsObj.locations.split(",").map((loc: string) => {
        return { value: loc, label: loc };
      });
      setSelectedLocation(locations);
    }
    if (paramsObj.start_time) {
      setFieldData((current) => {
        return {
          ...current,
          start_time: paramsObj.start_time,
        };
      });
    }
    if (paramsObj.end_time) {
      setFieldData((current) => {
        return {
          ...current,
          end_time: paramsObj.end_time,
        };
      });
    }
    if (paramsObj.tags) {
      const mapTags = paramsObj.tags.split(",").map((x: string) => {
        return { label: x, value: x };
      });
      setSelectedTag(mapTags);
    }

    if (paramsObj.UUID) {
      setFieldData((current) => {
        return { ...current, uuid: paramsObj.UUID };
      });
    }
  }, [search]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const buildQueryObj = () => {
    const queryObj: Record<string, any> = {};
    if (fieldData.start_time) {
      queryObj["start_time"] = timeStampFormat(
        extractDateFromString(fieldData.start_time),
      );
    }
    if (fieldData.end_time) {
      queryObj["end_time"] = timeStampFormat(
        extractDateFromString(fieldData.end_time),
      );
    }
    if (selectedHarvId && selectedHarvId.length > 0) {
      queryObj["harv_ids"] = translateHarvOptions(selectedHarvId);
    }
    if (selectedLocation && selectedLocation.length > 0) {
      queryObj["locations"] = translateLocOptions(selectedLocation);
    }
    if (selectedTag && selectedTag.length > 0) {
      queryObj["tags"] = selectedTag.map(
        (x: { label: string; value: string }) => x.value,
      );
    }
    if (fieldData.uuid) {
      queryObj["UUID"] = fieldData.uuid;
    }
    return queryObj;
  };

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(queryPickSession(buildQueryObj()));
    pushState(buildQueryObj(), PushStateEnum.PICKSESSIONS);
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex-right">
        <span className="btn btn-sm">
          <Link to={`/events`}>Go To Events </Link>
          <i className="las la-arrow-right"></i>
        </span>
      </div>
      <FormQuery
        handleFieldChange={handleFieldChange}
        handleSubmit={handleFormQuerySubmit}
        label="PickSession"
        theme={theme as string}
        fieldData={fieldData}
        handleHarvestSelect={handleHarvestSelect}
        handleLocationSelect={handleLocationSelect}
        harvesterOptions={harvesterOptions}
        locationOptions={locationOptions}
        selectedHarvId={selectedHarvId}
        selectedLocation={selectedLocation}
        handleTagSelect={handleTagSelect}
        selectedTag={selectedTag}
        tagOptions={tagOptions}
      />
    </div>
  );
}

export default PickSessionQuery;
