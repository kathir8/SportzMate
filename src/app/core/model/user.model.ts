import { SportType } from "src/app/shared/models/shared.model";

export class UserDetail {
  name: string = '';
  email: string = '';
  profile: string = '';
  customProfile: string = '';
  id: string = '';
  age?: number;
  gender?: 'male' | 'female' | null;
  interest: SportType[] = [];
}

export class UserExist extends UserDetail {
  exist: boolean = false;
}


export interface UserExistApi {
  emailId: string;
}

export interface UserExistApiResp {
  rspFlag: 'Y' | 'N';
  rspMsg: string;
}

export interface UserRegisterApi extends UserDetails {
  password: string;
}

export interface UserRegisterApiResp {

  resMsg: string;
  resFlag: string;
  userDetailsDto: userDetailsDto;
}

export interface userDetailsDto extends UserDetails {
  userID: 0;
  activeStatus: string
}

export interface UserDetails {
  name: string;
  profileImage: string;
  gender: string;
  age: string;
  email: string;
  countryName: string;
  userLoginFlag: string;
  fcmID: string;
}