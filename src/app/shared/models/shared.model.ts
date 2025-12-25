export enum SportType {
  Badminton = 'Badminton',
  Cricket = 'Cricket',
  Cycling = 'Cycling',
  Tennis = 'Tennis',
  Football = 'Football',
  Running = 'Running',
  Swimming = 'Swimming',
  Yoga = 'Yoga',
  Basketball = 'Basketball',
}

export interface SportsList{
  sportID:number;
  sportsName:string;
  sportsIcon:string;
  sportsImg:string;
}