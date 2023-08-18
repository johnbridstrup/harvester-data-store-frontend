import { useAppSelector } from "@/app/hooks";
import { Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { JobStatusHistory } from "../helpers";

function ListJobHistory() {
  const { jobstatuses, loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <JobStatusHistory jobstatuses={jobstatuses} theme={theme as string} />
      )}
    </>
  );
}

export default ListJobHistory;
