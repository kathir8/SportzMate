import { SportType } from "src/app/shared/models/shared.model";

export class UserDetail {
  name: string = '';
  email: string = '';
  profile: string = '';
  customProfile: string = '';
  id: string = '';
  age?:number;
  gender?:'male'|'female'|null;
  interest: SportType[]=[];
}

export class UserExist extends UserDetail {
    exist: boolean = false;
}