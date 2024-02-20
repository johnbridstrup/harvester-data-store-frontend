/**
 * Defines the api action methods
 */

import { rest } from "msw";
import { User } from "@/features/auth/authTypes";
import authService from "@/features/auth/authService";
import { S3FILE_URL } from "@/features/s3file/s3fileService";
import { NOTIFICATION_URL } from "@/features/notification/notificationService";
import { DISTRIBUTORS_URL } from "@/features/distributor/distributorService";
import { LOCATION_URL } from "@/features/location/locationService";
import {
  ERROR_PARETO_URL,
  ERROR_REPORT_URL,
} from "@/features/errorreport/errorreportService";
import {
  EXCEPTION_CODE_URL,
  EXCEPTION_URL,
  TB_ENDPOINT,
} from "@/features/exception/exceptionService";
import {
  FRUITS_URL,
  HARVESTERS_URL,
  HARVESTER_HISTORY_URL,
} from "@/features/harvester/harvesterService";
import { ParetoItem } from "@/components/errorreport/ErrorHelpers";
import { USERS_URL } from "@/features/users/usersService";
import notification from "@/test-utils/test-data/notification.json";
import s3file from "@/test-utils/test-data/s3file.json";
import distributor from "@/test-utils/test-data/distributor.json";
import location from "@/test-utils/test-data/location.json";
import errorreport from "@/test-utils/test-data/errorreport.json";
import exceptioncode from "@/test-utils/test-data/exceptioncode.json";
import fruit from "@/test-utils/test-data/fruit.json";
import user from "@/test-utils/test-data/user.json";
import { EVENTS_URL, PICKSESSION_URL } from "@/features/event/eventService";
import { MIGRATION_URL } from "@/features/migration/migrationService";
import { eventobj, picksession } from "@/test-utils/test-data/event";
import harvester from "@/test-utils/test-data/harvester.json";
import harvesterhistory from "@/test-utils/test-data/harvesterhistory.json";
import harvesterversion from "@/test-utils/test-data/harvesterversion.json";
import migration from "@/test-utils/test-data/migration.json";
import { AUTODIAG_REPORT_URL } from "@/features/autodiagnostic/autodiagnosticService";
import {
  autodiagdetail,
  autodiaglist,
} from "@/test-utils/test-data/autodiagnostic";
import { LOGSESSION_URL } from "@/features/logparser/logparserService";
import logsession from "@/test-utils/test-data/logsession.json";
import {
  JOBRESULTS_URL,
  JOBSCHEMAS_URL,
  JOBS_URL,
  JOBTYPES_URL,
} from "@/features/harvjob/harvjobService";
import {
  job,
  jobhistory,
  jobresults,
  jobschemas,
  jobtypes,
} from "@/test-utils/test-data/harvjob";
import { SCHEDULEDJOBS_URL } from "@/features/jobscheduler/jobschedulerService";
import scheduledjob from "@/test-utils/test-data/scheduledjob.json";
import {
  HARVESTER_RELEASE_URL,
  HARVESTER_VERSION_URL,
} from "@/features/harvdeploy/harvdeployService";
import releasecode from "@/test-utils/test-data/releasecode.json";
import { EMULATORSTATS_URL } from "@/features/emulatorstat/emulatorstatService";
import emustats from "@/test-utils/test-data/emustats.json";

interface Data {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<any>;
}

interface GenericListResponse {
  status: string;
  message: string;
  data: Data;
}

interface GenericGetResponse {
  status: string;
  message: string;
  data: Record<string, any>;
}

const genericListResponse: GenericListResponse = {
  status: "success",
  message: "any retrieved successfully",
  data: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
};

const genericGetResponse: GenericGetResponse = {
  status: "success",
  message: "any retrieved successfully",
  data: {},
};

const pareto: Array<ParetoItem> = [
  {
    value: "0",
    count: 2,
  },
  {
    value: "9",
    count: 5,
  },
];

export const login = rest.post(authService.LOGIN_URL, (_, res, ctx) => {
  // Persist user's authentication in the localstorage
  let token = "435b18abedef452f64e7f4ed2e68e98ac8babf5e";
  let user: User = {
    id: 1,
    first_name: "",
    last_name: "",
    username: "aft",
    email: "aft@aft.aft",
    is_active: true,
    is_staff: true,
    is_superuser: true,
    last_login: "2022-12-16T14:04:17.044622Z",
    profile: {
      id: 1,
      slack_id: "slack@aft.aft",
      user: 1,
      role: "developer",
    },
  };
  genericGetResponse["data"]["data"]["user"] = user;
  genericGetResponse["data"]["data"]["token"] = token;
  genericGetResponse["data"]["success"] = token;
  genericGetResponse["message"] = "Login successful";

  localStorage.setItem("isAuthenticated", JSON.stringify(true));
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  return res(
    // Respond with a 200 status code
    ctx.status(200),
    ctx.json(genericGetResponse),
  );
});

export const queryNotification = rest.get(NOTIFICATION_URL, (_, res, ctx) => {
  genericListResponse["message"] = "notification retrieved successfully";
  genericListResponse["data"]["results"] = [notification];
  return res(ctx.json(genericListResponse));
});

export const queryS3File = rest.get(S3FILE_URL, (_, res, ctx) => {
  genericListResponse["message"] = "s3file retrieved successfully";
  genericListResponse["data"]["results"] = [s3file];
  return res(ctx.json(genericListResponse));
});

export const getS3File = rest.get(`${S3FILE_URL}:s3fileId`, (_, res, ctx) => {
  genericGetResponse["message"] = "s3file retrieved successfully";
  genericGetResponse["data"] = s3file;
  return res(ctx.json(genericGetResponse));
});

export const queryDistributor = rest.get(DISTRIBUTORS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "distributor retrieved successfully";
  genericListResponse["data"]["results"] = [distributor];
  return res(ctx.json(genericListResponse));
});

export const queryLocation = rest.get(LOCATION_URL, (_, res, ctx) => {
  genericListResponse["message"] = "location retrieved successfully";
  genericListResponse["data"]["results"] = [location];
  return res(ctx.json(genericListResponse));
});

export const queryErrorReport = rest.get(ERROR_REPORT_URL, (_, res, ctx) => {
  genericListResponse["message"] = "errorreport retrieved successfully";
  genericListResponse["data"]["results"] = [errorreport];
  return res(ctx.json(genericListResponse));
});

export const getErrorReport = rest.get(
  `${ERROR_REPORT_URL}:reportId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "errorreport retrieved successfully";
    genericGetResponse["data"] = errorreport;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryExceptionCode = rest.get(
  EXCEPTION_CODE_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "exceptioncode retrieved successfully";
    genericListResponse["data"]["results"] = [exceptioncode];
    return res(ctx.json(genericListResponse));
  },
);

export const queryFruit = rest.get(FRUITS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "fruit retrieved successfully";
  genericListResponse["data"]["results"] = [fruit];
  return res(ctx.json(genericListResponse));
});

export const generatePareto = rest.get(ERROR_PARETO_URL, (_, res, ctx) => {
  genericGetResponse["message"] = "Pareto generated: Exceptions";
  genericGetResponse["data"] = pareto;
  return res(ctx.json(genericGetResponse));
});

export const queryUser = rest.get(USERS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "user retrieved successfully";
  genericListResponse["data"]["results"] = [user];
  return res(ctx.json(genericListResponse));
});

export const queryEvent = rest.get(EVENTS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "event retrieved successfully";
  genericListResponse["data"]["results"] = [eventobj];
  return res(ctx.json(genericListResponse));
});

export const getEvent = rest.get(`${EVENTS_URL}:eventId`, (_, res, ctx) => {
  genericGetResponse["message"] = "event retrieved successfully";
  genericGetResponse["data"] = eventobj;
  return res(ctx.json(genericGetResponse));
});

export const queryPickSession = rest.get(PICKSESSION_URL, (_, res, ctx) => {
  genericListResponse["message"] = "picksession retrieved successfully";
  genericListResponse["data"]["results"] = [picksession];
  return res(ctx.json(genericListResponse));
});

export const getPickSession = rest.get(
  `${PICKSESSION_URL}:pickId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "picksession retrieved successfully";
    genericGetResponse["data"] = picksession;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryHarvester = rest.get(HARVESTERS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "harvesters retrieved successfully";
  genericListResponse["data"]["results"] = [harvester];
  return res(ctx.json(genericListResponse));
});

export const getHarvester = rest.get(
  `${HARVESTERS_URL}:harvId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "harvester retrieved successfully";
    genericGetResponse["data"] = harvester;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryHarvesterHistory = rest.get(
  HARVESTER_HISTORY_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "harvester history retrieved successfully";
    genericListResponse["data"]["results"] = [harvesterhistory];
    return res(ctx.json(genericListResponse));
  },
);

export const getHarvesterHistory = rest.get(
  `${HARVESTER_HISTORY_URL}:historyId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "harvester history retrieved successfully";
    genericGetResponse["data"] = harvesterhistory;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryHarvesterVersion = rest.get(
  `${HARVESTERS_URL}:harvId/versions`,
  (_, res, ctx) => {
    genericListResponse["message"] = "Harvester 11 version history";
    genericListResponse["data"]["results"] = [harvesterversion];
    return res(ctx.json(genericListResponse));
  },
);

export const queryMigrationLog = rest.get(MIGRATION_URL, (_, res, ctx) => {
  genericListResponse["message"] = "hdsmigration retrieved successfully";
  genericListResponse["data"]["results"] = [migration];
  return res(ctx.json(genericListResponse));
});

export const getMigrationLog = rest.get(
  `${MIGRATION_URL}:migrationId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "hdsmigration retrieved successfully";
    genericGetResponse["data"] = migration;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryAutodiagReport = rest.get(
  AUTODIAG_REPORT_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "autodiagnostic retrieved successfully";
    genericListResponse["data"]["results"] = [autodiaglist];
    return res(ctx.json(genericListResponse));
  },
);

export const getAutodiagReport = rest.get(
  `${AUTODIAG_REPORT_URL}:reportId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "autodiagnostic retrieved successfully";
    genericGetResponse["data"] = autodiagdetail;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryLogSession = rest.get(LOGSESSION_URL, (_, res, ctx) => {
  genericListResponse["message"] = "logsession retrieved successfully";
  genericListResponse["data"]["results"] = [logsession];
  return res(ctx.json(genericListResponse));
});

export const getLogSession = rest.get(
  `${LOGSESSION_URL}:logsessionId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "logsession retrieved successfully";
    genericGetResponse["data"] = logsession;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryJob = rest.get(JOBS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "harvjobs retrieved successfully";
  genericListResponse["data"]["results"] = [job];
  return res(ctx.json(genericListResponse));
});

export const getJob = rest.get(`${JOBS_URL}:jobId`, (_, res, ctx) => {
  genericGetResponse["message"] = "harvjobs retrieved successfully";
  genericGetResponse["data"] = job;
  return res(ctx.json(genericGetResponse));
});

export const queryJobType = rest.get(JOBTYPES_URL, (_, res, ctx) => {
  genericListResponse["message"] = "jobtypes retrieved successfully";
  genericListResponse["data"]["results"] = [jobtypes];
  return res(ctx.json(genericListResponse));
});

export const getJobType = rest.get(
  `${JOBTYPES_URL}:jobtypeId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "jobtypes retrieved successfully";
    genericGetResponse["data"] = jobtypes;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryJobSchema = rest.get(JOBSCHEMAS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "jobschemas retrieved successfully";
  genericListResponse["data"]["results"] = [jobschemas];
  return res(ctx.json(genericListResponse));
});

export const getJobSchema = rest.get(
  `${JOBSCHEMAS_URL}:jobschemaId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "jobschemas retrieved successfully";
    genericGetResponse["data"] = jobschemas;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryJobResult = rest.get(JOBRESULTS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "jobresults retrieved successfully";
  genericListResponse["data"]["results"] = [jobresults];
  return res(ctx.json(genericListResponse));
});

export const getJobResult = rest.get(
  `${JOBRESULTS_URL}:jobresultId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "jobresults retrieved successfully";
    genericGetResponse["data"] = jobresults;
    return res(ctx.json(genericGetResponse));
  },
);

export const getJobHistory = rest.get(
  `${JOBS_URL}:jobId/history/`,
  (_, res, ctx) => {
    genericListResponse["message"] = "job history retrieved successfully";
    genericListResponse["data"]["results"] = [jobhistory];
    return res(ctx.json(genericListResponse));
  },
);

export const queryScheduledJob = rest.get(SCHEDULEDJOBS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "jobscheduler retrieved successfully";
  genericListResponse["data"]["results"] = [scheduledjob];
  return res(ctx.json(genericListResponse));
});

export const getScheduledJob = rest.get(
  `${SCHEDULEDJOBS_URL}:jobId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "jobscheduler retrieved successfully";
    genericGetResponse["data"] = scheduledjob;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryVersionReport = rest.get(
  HARVESTER_VERSION_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "harvversion retrieved successfully";
    genericListResponse["data"]["results"] = [harvesterversion];
    return res(ctx.json(genericListResponse));
  },
);

export const getVersionReport = rest.get(
  `${HARVESTER_VERSION_URL}:versionId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "harvversion retrieved successfully";
    genericGetResponse["data"] = harvesterversion;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryReleaseCode = rest.get(
  HARVESTER_RELEASE_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "harvcoderelease retrieved successfully";
    genericListResponse["data"]["results"] = [releasecode];
    return res(ctx.json(genericListResponse));
  },
);

export const getReleaseCode = rest.get(
  `${HARVESTER_RELEASE_URL}:releaseId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "harvcoderelease retrieved successfully";
    genericGetResponse["data"] = releasecode;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryInstalled = rest.get(
  `${HARVESTER_RELEASE_URL}:releaseId/harvesters`,
  (_, res, ctx) => {
    genericListResponse["message"] =
      "installed harvesters retrieved successfully";
    genericListResponse["data"]["results"] = [harvester];
    return res(ctx.json(genericListResponse));
  },
);

export const queryEmulatorstat = rest.get(EMULATORSTATS_URL, (_, res, ctx) => {
  genericListResponse["message"] = "emulatorstats retrieved successfully";
  genericListResponse["data"]["results"] = [emustats];
  return res(ctx.json(genericListResponse));
});

export const getEmulatorstat = rest.get(
  `${EMULATORSTATS_URL}:emustatsId`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "emulatorstats retrieved successfully";
    genericGetResponse["data"] = emustats;
    return res(ctx.json(genericGetResponse));
  },
);

export const queryEmulatorstatTag = rest.get(
  `${EMULATORSTATS_URL}tags`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "emulatorstats tags";
    genericGetResponse["data"] = {
      tags: ["Incomplete", "Invalid", "Unset"],
    };
    return res(ctx.json(genericGetResponse));
  },
);

export const queryTBBreakdown = rest.get(
  `${EXCEPTION_URL}${TB_ENDPOINT}`,
  (_, res, ctx) => {
    genericGetResponse["message"] = "Traceback Breakdown";
    genericGetResponse["data"] = {
      "1": {
        count: 1,
        example:
          "A very different traceback from the rest of them\n\n\t454545454545+42ABadException",
        ids: [4],
      },
    };
    return res(ctx.json(genericGetResponse));
  },
);
