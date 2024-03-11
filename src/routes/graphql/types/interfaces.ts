export interface IUser {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo?: ISubscribersOnAuthors[];
  subscribedToUser?: ISubscribersOnAuthors[];
}

export interface ISubscribersOnAuthors {
  subscriberId: string;
  authorId: string;
  subscriber?: IUser;
  author?: IUser;
}

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  user?: IUser;
  memberTypeId: string;
  memberType?: IMemberType;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: IUser;
}

export interface IMemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
  profiles?: IProfile[];
}

export interface IChangePost {
  id: string;
  dto: {
    authorId: string;
    title: string;
    content: string;
  };
}
