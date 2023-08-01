import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryEvent } from "@/features/event/eventSlice";
import { paramsToObject, pushState } from "@/utils/utils";
import { PushStateEnum } from "@/features/base/constants";
import { FormQuery } from "./EventHelpers";

function EventQuery() {
  const [fieldData, setFieldData] = useState({
    uuid: "",
  });
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    if (paramsObj.UUID)
      setFieldData((current) => {
        return { ...current, uuid: paramsObj.UUID };
      });
  }, [search]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();

    const queryObj: Record<string, any> = {};

    if (fieldData.uuid) {
      queryObj["UUID"] = fieldData.uuid;
    }
    dispatch(queryEvent(queryObj));
    pushState(queryObj, PushStateEnum.EVENTS);
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex-right">
        <span className="btn btn-sm">
          <Link to={`/picksessions`}>Go To PickSession </Link>
          <i className="las la-arrow-right"></i>
        </span>
      </div>
      <FormQuery
        handleSubmit={handleFormQuerySubmit}
        handleFieldChange={handleFieldChange}
        label="UUID"
        theme={theme as string}
        fieldData={fieldData}
      />
    </div>
  );
}

export default EventQuery;
