import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import EventQuery from "@/components/event/EventQuery";
import EventList from "@/components/event/EventList";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { EventPagination } from "@/components/pagination";
import { queryEvent } from "@/features/event/eventSlice";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function EventListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    dispatch(queryEvent(paramsToObject(search)));
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Events"} className={"display-6 mt-4 mb-4"} />
        <EventQuery />
        <EventList />
        <EventPagination />
      </div>
    </MainLayout>
  );
}

export default EventListView;
