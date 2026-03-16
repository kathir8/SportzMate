import { ApiResp } from "src/app/shared/models/shared.model";

export class ProfileInfo {
  age?: string = '';
  email: string = '';
  countryName: string = '';
  gender: 'male' | 'female' | null = null;
  name: string = '';
  profileImage: string = '';
}
export class UserDetail extends ProfileInfo {

  userLoginFlag: boolean = false;
  userID: string = '';
  interestedSportsIds: string = '';
  currentLocationCountry: string = '';
  fcmDetail: FcmDetail = new FcmDetail();
}


export class FcmDetail {
  fcmToken: string = '';
  deviceType: string = '';
  deviceId: string = '';
  deviceName: string = '';
  isActive: boolean = true;
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