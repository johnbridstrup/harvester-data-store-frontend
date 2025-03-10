import { ChangeEvent, useState, FC } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { paginateDistributor } from "@/features/distributor/distributorSlice";
import {
  paginateEvent,
  paginatePickSession,
} from "@/features/event/eventSlice";
import { paginateLocation } from "@/features/location/locationSlice";
import { paginateNotification } from "@/features/notification/notificationSlice";
import { paginateS3File } from "@/features/s3file/s3fileSlice";
import {
  cacheParamsObj,
  paginateErrorReport,
} from "@/features/errorreport/errorreportSlice";
import { ERROR_REPORT_URL } from "@/features/errorreport/errorreportService";
import {
  paginateHarvester,
  paginateHarvesterHistory,
  paginateHarvesterSwInfo,
  paginateHarvesterVersion,
} from "@/features/harvester/harvesterSlice";
import { darkThemeClass, mapCurrentOffset } from "@/utils/utils";
import { InputLimit, PageItem, SpanLimit } from "../styled";
import { paginateUser } from "@/features/users/usersSlice";
import { paginateMigration } from "@/features/migration/migrationSlice";
import { paginateAutodiagReport } from "@/features/autodiagnostic/autodiagnosticSlice";
import { paginateLogSession } from "@/features/logparser/logparserSlice";
import {
  paginateJobResult,
  paginateJobSchema,
  paginateJobStatus,
  paginateJobType,
} from "@/features/harvjob/harvjobSlice";
import { paginateScheduledJob } from "@/features/jobscheduler/jobschedulerSlice";
import {
  paginateRelease,
  paginateVersion,
} from "@/features/harvdeploy/harvdeploySlice";
import { paginateEmulatorstats } from "@/features/emulatorstat/emulatorstatSlice";
import { HARVESTERSWINFO_URL } from "@/features/harvester/harvesterService";

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

export function Pagination() {
  const [pageLimit, setPageLimit] = useState(10);
  const {
    queryUrl,
    pagination: { next, previous },
  } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  const handleOnLimitChange = (limit: number) => {
    setPageLimit(limit);
  };

  const handleOnLimitSubmit = async () => {
    let url;
    if (typeof queryUrl === "string" && queryUrl.length > 0) {
      url = new URL(queryUrl);
      url.searchParams.set("limit", String(pageLimit));
      await dispatch(
        paginateErrorReport(
          `${ERROR_REPORT_URL}?${url.searchParams.toString()}`,
        ),
      );
    } else {
      let urlStr = `${ERROR_REPORT_URL}${search.toString()}`;
      url = new URL(urlStr);
      url.searchParams.set("limit", String(pageLimit));
      await dispatch(paginateErrorReport(url.href));
    }
  };

  const handlePagination = async (navigation: string) => {
    const urlMap: { [key: string]: string | null } = {
      next: next,
      previous: previous,
    };
    const url = new URL(String(urlMap[navigation]));
    if (import.meta.env.PROD) {
      url.protocol = "https:";
    }
    url.searchParams.set("limit", String(pageLimit));
    const res = await dispatch(paginateErrorReport(url.href));
    const paramsObj = mapCurrentOffset(
      res.payload?.previous,
      res.payload?.next,
    );
    dispatch(cacheParamsObj(paramsObj || {}));
  };

  const btn = darkThemeClass("btn-dark", theme);

  return (
    <div>
      <section className="d-flex justify-content-center align-items-center mb-5">
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-0">
            <li className="page-item cursor">
              <span
                onClick={() => handlePagination("previous")}
                className={`page-link ${!previous && "disabled"}`}
                aria-label="Previous"
              >
                <span aria-hidden="true">Previous</span>
              </span>
            </li>
            <li className="page-item cursor">
              <span
                onClick={() => handlePagination("next")}
                className={`page-link ${!next && "disabled"}`}
                aria-label="Next"
              >
                <span aria-hidden="true">Next</span>
              </span>
            </li>
            <PageItem>
              <SpanLimit>Limit</SpanLimit>
              <InputLimit
                type="number"
                value={pageLimit}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOnLimitChange(Number(e.target.value))
                }
              />
              <SpanLimit
                className={`btn btn-sm ${btn}`}
                onClick={handleOnLimitSubmit}
              >
                Go
              </SpanLimit>
            </PageItem>
          </ul>
        </nav>
      </section>
    </div>
  );
}

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

export const S3FilePagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.s3file);
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
    await dispatch(paginateS3File(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const DistributorPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.distributor);
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
    await dispatch(paginateDistributor(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const LocationPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.location);
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
    await dispatch(paginateLocation(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const UserPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.user);
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
    await dispatch(paginateUser(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const EventPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.event);
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
    await dispatch(paginateEvent(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const PicksessionPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.event);
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
    await dispatch(paginatePickSession(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const HarvesterPagination = ({ attr }: { attr?: string }) => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.harvester);
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
    if (attr === "harvesterversion") {
      await dispatch(paginateHarvesterVersion(url.href));
    } else if (attr === "harvesterhistory") {
      await dispatch(paginateHarvesterHistory(url.href));
    } else if (attr === "harvesterswinfo") {
      dispatch(paginateHarvesterSwInfo(url.href));
    } else {
      await dispatch(paginateHarvester(url.href));
    }
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const ReportPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.errorreport);
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
    await dispatch(paginateErrorReport(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const MigrationPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.migration);
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
    await dispatch(paginateMigration(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const AutodiagPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.autodiagnostic);
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
    await dispatch(paginateAutodiagReport(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const LogSessionPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.logparser);
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
    await dispatch(paginateLogSession(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const HarvJobPagination = ({ attr }: { attr?: string }) => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.harvjob);
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
    if (attr === "jobtype") {
      await dispatch(paginateJobType(url.href));
    } else if (attr === "jobschema") {
      await dispatch(paginateJobSchema(url.href));
    } else if (attr === "jobresult") {
      await dispatch(paginateJobResult(url.href));
    } else if (attr === "jobstatus") {
      await dispatch(paginateJobStatus(url.href));
    } else {
      await dispatch(paginateErrorReport(url.href));
    }
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const SJPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.jobscheduler);
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
    await dispatch(paginateScheduledJob(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const HDPagination = ({ attr }: { attr?: string }) => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.harvdeploy);
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
    if (attr === "version") {
      await dispatch(paginateVersion(url.href));
    } else {
      await dispatch(paginateRelease(url.href));
    }
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const EmulatorStatPagination = () => {
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.emulatorstat);
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
    await dispatch(paginateEmulatorstats(url.href));
  };

  return (
    <GenericRenderer
      handlePagination={handlePagination}
      next={next}
      previous={previous}
    />
  );
};

export const SWInfoPagination: FC = () => {
  const [pageLimit, setPageLimit] = useState(10);
  const {
    pagination: { next, previous },
  } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  const handleOnLimitChange = (limit: number) => {
    setPageLimit(limit);
  };

  const handleOnLimitSubmit = async () => {
    let urlStr: string = `${HARVESTERSWINFO_URL}${search.toString()}`;
    let url: URL = new URL(urlStr);
    url.searchParams.set("limit", String(pageLimit));
    await dispatch(paginateHarvesterSwInfo(url.href));
  };

  const handlePagination = async (navigation: string) => {
    const urlMap: { [key: string]: string | null } = {
      next: next,
      previous: previous,
    };
    const url = new URL(String(urlMap[navigation]));
    if (import.meta.env.PROD) {
      url.protocol = "https:";
    }
    url.searchParams.set("limit", String(pageLimit));
    await dispatch(paginateHarvesterSwInfo(url.href));
  };

  const btn = darkThemeClass("btn-dark", theme);
  return (
    <div>
      <section className="d-flex justify-content-center align-items-center mb-5">
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-0">
            <li className="page-item cursor">
              <span
                onClick={() => handlePagination("previous")}
                className={`page-link ${!previous && "disabled"}`}
                aria-label="Previous"
              >
                <span aria-hidden="true">Previous</span>
              </span>
            </li>
            <li className="page-item cursor">
              <span
                onClick={() => handlePagination("next")}
                className={`page-link ${!next && "disabled"}`}
                aria-label="Next"
              >
                <span aria-hidden="true">Next</span>
              </span>
            </li>
            <PageItem>
              <SpanLimit>Limit</SpanLimit>
              <InputLimit
                type="number"
                value={pageLimit}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOnLimitChange(Number(e.target.value))
                }
              />
              <SpanLimit
                className={`btn btn-sm ${btn}`}
                onClick={handleOnLimitSubmit}
              >
                Go
              </SpanLimit>
            </PageItem>
          </ul>
        </nav>
      </section>
    </div>
  );
};
