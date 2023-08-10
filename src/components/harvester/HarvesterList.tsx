import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SUCCESS } from "@/features/base/constants";
import {
  createHarvester,
  queryHarvester,
  updateHarvester,
} from "@/features/harvester/harvesterSlice";
import {
  handleSelectFactory,
  transformFruitOptions,
  transformLocOptions,
} from "@/utils/utils";
import HarvesterModal from "../modals/HarvesterModal";
import { LoaderDiv } from "../styled";
import HarvesterTable from "../tables/HarvesterTable";
import { Loader } from "../common";
import { HarvesterArray } from "@/features/harvester/harvesterTypes";

interface HarvData {
  name: string;
  harv_id: number | string;
  mode: string;
  id: number | null;
}

function HarvesterList() {
  const [fieldData, setFieldData] = useState<HarvData>({
    name: "",
    harv_id: "",
    mode: "add",
    id: null,
  });
  const [selectedFruit, setSelectedFruit] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const { harvesters, loading, fruits } = useAppSelector(
    (state) => state.harvester,
  );
  const { locations } = useAppSelector((state) => state.location);
  const { theme } = useAppSelector((state) => state.home);
  const fruitOptions = transformFruitOptions(fruits, true);
  const locationOptions = transformLocOptions(locations, true);
  const dispatch = useAppDispatch();
  const harvesterRef = useRef<HTMLButtonElement | null>(null);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const callback = async (res: any) => {
    if (res.payload?.status === SUCCESS) {
      await dispatch(queryHarvester({}));
      toast.success(res?.payload?.message);
      addPopUp();
      setFieldData((current) => {
        return { ...current, name: "", harv_id: "", mode: "add", id: null };
      });
      setSelectedFruit(null);
      setSelectedLocation(null);
    } else {
      toast.error(res?.payload);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data: Record<string, any> = {};
    if (selectedFruit && selectedFruit.hasOwnProperty("value")) {
      data["fruit"] = selectedFruit.value;
    }
    if (selectedLocation && selectedLocation.hasOwnProperty("value")) {
      data["location"] = selectedLocation.value;
    }
    data["name"] = fieldData.name;
    data["harv_id"] = fieldData.harv_id;
    data["id"] = fieldData.id;

    if (fieldData.mode === "add") {
      const res = await dispatch(createHarvester(data));
      callback(res);
    } else if (fieldData.mode === "edit") {
      const res = await dispatch(updateHarvester(data));
      callback(res);
    }
  };

  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleFruitSelect = handleSelectFactory(setSelectedFruit);

  const addPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return { ...current, name: "", harv_id: "", mode: "add", id: null };
      });
      setSelectedFruit(null);
      setSelectedLocation(null);
    }
    harvesterRef.current?.click();
  };

  const handleHarvUpdateClick = (harvObj: HarvesterArray) => {
    setFieldData((current) => {
      return {
        ...current,
        name: harvObj.name,
        harv_id: harvObj.harv_id,
        mode: "edit",
        id: harvObj.id,
      };
    });
    let fruitObj = { value: harvObj.fruit.id, label: harvObj.fruit.name };
    let locObj = { value: harvObj.location.id, label: harvObj.location.ranch };
    setSelectedFruit(fruitObj);
    setSelectedLocation(locObj);
    addPopUp();
  };
  return (
    <>
      <div className="flex-right mb-4">
        <button onClick={() => addPopUp("add")} className="btn btn-primary">
          Add New Harvester
        </button>
        <button
          ref={harvesterRef}
          data-bs-toggle="modal"
          data-bs-target="#harvesterModal"
          style={{ display: "none" }}
        >
          Add New Harvester
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <HarvesterTable
          harvesters={harvesters}
          handleHarvUpdateClick={handleHarvUpdateClick}
          theme={theme as string}
        />
      )}
      <HarvesterModal
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        fruitOptions={fruitOptions}
        selectedFruit={selectedFruit}
        handleFruitSelect={handleFruitSelect}
        locationOptions={locationOptions}
        selectedLocation={selectedLocation}
        handleLocSelect={handleLocationSelect}
        theme={theme as string}
        loading={false}
      />
    </>
  );
}

export default HarvesterList;
