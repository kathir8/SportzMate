import { ApiResp } from "src/app/shared/models/shared.model";

export class UserDetail {
  name: string = '';
  profileImage: string = '';
  gender: 'male' | 'female' | null = null;
  age?: string = '';
  email: string = '';
  countryName: string = '';
  userLoginFlag: boolean = false;
  fcmID: string = '';
  interestedSportsIds: string = '';
  userID: number = 0;
  currentLocationCountry: string = '';
}

export class UserExist extends UserDetail {
  exist: boolean = false;
}

export class UserRegisterApi extends UserDetail {
  password: string = '';
}

export interface UserRegisterApiResp extends ApiResp {
  userDetailsDto: UserDetail;
}