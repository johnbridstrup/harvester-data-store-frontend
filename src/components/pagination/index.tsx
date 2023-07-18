import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { paginateNotification } from "@/features/notification/notificationSlice";

interface RendererProps {
  handlePagination: (navigation: string) => void;
  previous: string | null;
  next: string | null;
}

const GenericRenderer = (props: RendererProps) => {
  return (
    <div>
      <section className="d-flex justify-content-center align-items-center mb-5">
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-0">
            <li className="page-item cursor">
              <span
                onClick={() => props.handlePagination("previous")}
                className={`page-link ${!props.previous && "disabled"}`}
                aria-label="Previous"
              >
                <span aria-hidden="true">Previous</span>
              </span>
            </li>
            <li className="page-item cursor">
              <span
                onClick={() => props.handlePagination("next")}
                className={`page-link ${!props.next && "disabled"}`}
                aria-label="Next"
              >
                <span aria-hidden="true">Next</span>
              </span>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export const NotificationPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handlePagination = async (navigation: string) => {
    const urlMap: { [key: string]: string | null } = {
      next: next,
      previous: previous,
    };
    const url = new URL(String(urlMap[navigation]));
    if (import.meta.env.PROD) {
      url.protocol = "https:";
    }
    await dispatch(paginateNotification(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};
