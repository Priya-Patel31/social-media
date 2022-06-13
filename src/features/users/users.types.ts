import { Status } from "../../generic.types";
import { User } from "../auth/auth.types";

export type usersInitialState ={
    users : User[],
    fetchUsersStatus : Status

}