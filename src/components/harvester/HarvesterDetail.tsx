import { useAppSelector } from "@/app/hooks";
import HarvesterDetailTable from "../tables/HarvesterDetailTable";
import RecentHarvErrors from "./RecentHarvesterErrors";
import SchemaTabsView from "./SchemaTabsView";

function HarvesterDetail() {
  const { harvester } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  return (
    <>
      <HarvesterDetailTable harvester={harvester} theme={theme as string} />
      <RecentHarvErrors />
      <SchemaTabsView harvester={harvester} theme={theme as string} />
    </>
  );
}

export default HarvesterDetail;
