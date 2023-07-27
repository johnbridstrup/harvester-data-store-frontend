import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Theme, toast } from "react-toastify";
import { SUCCESS, THEME_MODES } from "@/features/base/constants";
import {
  createDistributor,
  queryDistributor,
  updateDistributor,
} from "@/features/distributor/distributorSlice";
import { Loader } from "@/components/common";
import DistributorModal from "../modals/DistributorModal";
import { LoaderDiv } from "../styled";
import DistributorTable from "../tables/DistributorTable";

function DistributorList() {
  const [fieldData, setFieldData] = useState<{
    name: string;
    mode: string;
    id: number | null;
  }>({
    name: "",
    mode: "add",
    id: null,
  });
  const { distributors, loading } = useAppSelector(
    (state) => state.distributor,
  );
  const { theme } = useAppSelector((state) => state.home);
  const distributorRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();

  const addPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return { ...current, name: "", mode: "add", id: null };
      });
    }
    distributorRef.current?.click();
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const callback = async (res: any) => {
    await dispatch(queryDistributor({}));
    toast.success(res?.payload?.message, {
      theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
    });
    addPopUp();
    setFieldData((current) => {
      return { ...current, name: "", mode: "add", id: null };
    });
  };
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let data = {
      name: fieldData.name,
      id: fieldData.id as number,
    };
    if (fieldData.mode === "add") {
      const res = await dispatch(createDistributor(data));
      if (res.payload?.status === SUCCESS) {
        callback(res);
      }
    } else {
      const res = await dispatch(updateDistributor(data));
      if (res.payload?.status === SUCCESS) {
        callback(res);
      }
    }
  };

  const handleDistUpdateClick = (obj: { name: string; id: number }) => {
    setFieldData((current) => {
      return { ...current, name: obj.name, mode: "edit", id: obj.id };
    });
    addPopUp();
  };

  return (
    <>
      <div className="flex-right">
        <button onClick={() => addPopUp("add")} className="btn btn-primary">
          Add New Distributor
        </button>
        <button
          ref={distributorRef}
          data-bs-toggle="modal"
          data-bs-target="#distributorModal"
          style={{ display: "none" }}
        >
          Add New Distributor
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <DistributorTable
          distributors={distributors}
          handleDistUpdateClick={handleDistUpdateClick}
          theme={theme as string}
        />
      )}
      <DistributorModal
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        theme={theme as string}
      />
    </>
  );
}

export default DistributorList;
