import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
type Props = {
  path: string;
  children: ReactNode;
};

export const PrivateRoute: any = ({ path, children }: Props) => { // TO-DO
  const user = localStorage.getItem("uid");
  return user ? (
    children
  ) : (
    <Navigate replace to="/login" state={{ from: path }} />
  );
};
