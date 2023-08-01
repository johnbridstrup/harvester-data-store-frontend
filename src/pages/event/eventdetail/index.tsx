import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import EventDetail from "@/components/event/EventDetail";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { getEvent } from "@/features/event/eventSlice";
import { BackButton } from "@/components/common";
import "./styles.css";

function EventDetailView() {
  const { theme } = useAppSelector((state) => state.home);
  const { eventId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEvent(Number(eventId)));
  }, [dispatch, eventId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Event"}
          className={"display-6 mt-4 mb-4"}
          id={eventId}
        />
        <BackButton mb="mb-4" theme={theme as string} />
        <EventDetail />
      </div>
    </MainLayout>
  );
}

export default EventDetailView;
