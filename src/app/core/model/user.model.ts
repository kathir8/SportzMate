import { ApiResp } from "src/app/shared/models/shared.model";


export class ProfileInfo {
  age?: string = '';
  email: string = '';
  countryName: string = '';
  gender: 'male' | 'female' | null = null;
  name: string = '';
  profileImage: string = '';
  userID: number = 0;
}
export class UserDetail extends ProfileInfo {

  userLoginFlag: boolean = false;
  fcmID: string = '';
  interestedSportsIds: string = '';
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