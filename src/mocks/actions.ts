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
import { EXCEPTION_CODE_URL } from "@/features/exception/exceptionService";
import { FRUITS_URL } from "@/features/harvester/harvesterService";
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
import { eventobj, picksession } from "@/test-utils/test-data/event";

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
    userId: "1",
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
