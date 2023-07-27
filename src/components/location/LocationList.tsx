import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { toast } from "react-toastify";
import { SUCCESS } from "@/features/base/constants";
import {
  createLocation,
  queryLocation,
  updateLocation,
} from "@/features/location/locationSlice";
import { Loader } from "@/components/common";
import { transformDistOptions } from "@/utils/utils";
import LocationModal from "../modals/LocationModal";
import { LoaderDiv } from "../styled";
import LocationTable from "../tables/LocationTable";
import { LocationObj } from "@/features/location/locationTypes";

export interface LocData {
  ranch: string;
  country: string;
  region: string;
  mode: string;
  id: number | null;
  siteChannel: string;
}

function LocationList() {
  const [fieldData, setFieldData] = useState<LocData>({
    ranch: "",
    country: "",
    region: "",
    mode: "add",
    id: null,
    siteChannel: "",
  });
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const { locations, loading } = useAppSelector((state) => state.location);
  const { distributors } = useAppSelector((state) => state.distributor);
  const { theme } = useAppSelector((state) => state.home);
  const distributorOptions = transformDistOptions(distributors);
  const dispatch = useAppDispatch();
  const locationRef = useRef<HTMLButtonElement>(null);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleDistrSelect = (newValue: any) => {
    setSelectedDistributor(newValue);
  };

  const callback = async (res: any) => {
    if (res.payload?.status === SUCCESS) {
      await dispatch(queryLocation({}));
      toast.success(res?.payload?.message);
      addPopUp();
      setFieldData((current) => {
        return {
          ...current,
          ranch: "",
          country: "",
          region: "",
          mode: "add",
          id: null,
          siteChannel: "",
        };
      });
      setSelectedDistributor(null);
    } else {
      toast.error(res?.payload);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data: Record<string, any> = {};
    if (selectedDistributor && selectedDistributor.hasOwnProperty("value")) {
      data["distributor"] = selectedDistributor.value;
    }
    data["ranch"] = fieldData.ranch;
    data["country"] = fieldData.country;
    data["region"] = fieldData.region;
    data["id"] = fieldData.id;
    data["site_channel"] = fieldData.siteChannel;

    if (fieldData.mode === "add") {
      const res = await dispatch(createLocation(data));
      callback(res);
    } else if (fieldData.mode === "edit") {
      const res = await dispatch(updateLocation(data));
      callback(res);
    }
  };

  const addPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return {
          ...current,
          ranch: "",
          country: "",
          region: "",
          mode: "add",
          id: null,
          siteChannel: "",
        };
      });
      setSelectedDistributor(null);
    }
    locationRef.current?.click();
  };

  const handleLocUpdateClick = (location: LocationObj) => {
    setFieldData((current) => {
      return {
        ...current,
        ranch: location.ranch,
        country: location.country,
        mode: "edit",
        region: location.region,
        id: location.id,
        siteChannel: location.site_channel,
      };
    });
    let distObj = {
      value: location.distributor.id,
      label: location.distributor.name,
    };
    setSelectedDistributor(distObj);
    addPopUp();
  };

  return (
    <>
      <div className="flex-right">
        <button onClick={() => addPopUp("add")} className="btn btn-primary">
          Add New Location
        </button>
        <button
          ref={locationRef}
          data-bs-toggle="modal"
          data-bs-target="#locationModal"
          style={{ display: "none" }}
        >
          Add New Location
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <LocationTable
          locations={locations}
          handleLocUpdateClick={handleLocUpdateClick}
          theme={theme as string}
        />
      )}
      <LocationModal
        distributorOptions={distributorOptions}
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        handleDistrSelect={handleDistrSelect}
        selectedDistributor={selectedDistributor}
        theme={theme as string}
      />
    </>
  );
}

export default LocationList;
