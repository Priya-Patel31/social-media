import { Status } from "../../generic.types";

export type signupState = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type signinState = {
  email: string;
  password: string;
};
export type authResponse = {
  uid: string;
  name: string;
  username: string;
  email: string;
};
export type authInitialState = {
    user : authResponse | null  ;
    signupStatus: Status;
    signinStatus : Status;
}
