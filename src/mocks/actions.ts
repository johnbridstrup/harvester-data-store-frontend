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
import notification from "@/test-utils/test-data/notification.json";
import s3file from "@/test-utils/test-data/s3file.json";
import distributor from "@/test-utils/test-data/distributor.json";
import location from "@/test-utils/test-data/location.json";

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
