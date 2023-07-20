/**
 * Module for Auth Protection Guards
 * @module Guards
 */

import { ReactNode, FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

interface GenericProps {
  children: ReactNode;
}

export const RequireUser: FC<GenericProps> = (props) => {
  const { token, user } = useAppSelector((state) => state.auth);

  if (token && user) {
    return props.children;
  } else {
    return <Navigate to={{ pathname: "/login" }} />;
  }
};

export const UserAuth: FC<GenericProps> = (props) => {
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  if (token && user && isAuthenticated) {
    return <Navigate to={{ pathname: "/" }} />;
  } else {
    return props.children;
  }
};

export const IsAdminOnly: FC<GenericProps> = (props) => {
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  if (token && isAuthenticated && user?.is_superuser) {
    return props.children;
  } else {
    return <Navigate to={{ pathname: "/forbidden" }} />;
  }
};
