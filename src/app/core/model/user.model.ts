export class UserDetail {
  name: string = '';
  profileImage: string = '';
  gender: 'male' | 'female' | null = null;
  age?: string = '';
  email: string = '';
  countryName: string = '';
  userLoginFlag: string = '';
  fcmID: string = '';
  interest: number[] = [];
  userID: number = 0;
}

export class UserExist extends UserDetail {
  exist: boolean = false;
}

export class UserRegisterApi extends UserDetail {
  password: string = '';
}

export interface UserRegisterApiResp {

  resMsg: string;
  resFlag: string;
  userDetailsDto: UserDetail;
}


export interface UserDeleteApiResp {
  rspMsg: string;
}