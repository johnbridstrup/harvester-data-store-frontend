/**
 * Defines the api action methods
 */

import { rest } from "msw";
import { User } from "@/features/auth/authTypes";
import authService from "@/features/auth/authService";
import notificationService from "@/features/notification/notificationService";
import notification from "@/test-utils/test-data/notification.json";

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

export const queryNotification = rest.get(
  notificationService.NOTIFICATION_URL,
  (_, res, ctx) => {
    genericListResponse["message"] = "notification retrieved successfully";
    genericListResponse["data"]["results"] = [notification];
    return res(ctx.json(genericListResponse));
  },
);
