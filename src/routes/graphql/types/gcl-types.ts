import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLOutputType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

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

interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  user?: IUser;
  memberTypeId: string;
  memberType?: IMemberType;
}

interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: IUser;
}

interface IMemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
  profiles?: IProfile[];
}

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

const prisma = new PrismaClient();

export const UserType = new GraphQLObjectType<IUser>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType as GraphQLOutputType,
      resolve: async ({ id }: IUser) =>
        await prisma.profile.findFirst({ where: { userId: id } }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: IUser) =>
        await prisma.post.findMany({ where: { authorId: id } }),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: IUser) => {
        const data = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: id },
          select: { author: true },
        });
        return data.map(({ author }) => author);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: IUser) => {
        const data = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: id },
          select: { subscriber: true },
        });
        return data.map(({ subscriber }) => subscriber);
      },
    },
  }),
});

export const SubscribersOnAuthorsType = new GraphQLObjectType<ISubscribersOnAuthors>({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriberId: { type: UUIDType },
    authorId: { type: UUIDType },
    subscriber: { type: new GraphQLList(UserType) },
    author: { type: UserType as GraphQLOutputType },
  }),
});

export const ProfileType = new GraphQLObjectType<IProfile>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLString },
    user: { type: new GraphQLList(UserType) },
    memberTypeId: { type: MemberTypeIdType },
    memberType: {
      type: MemberType as GraphQLOutputType,
      resolve: async ({ memberTypeId }: IProfile) =>
        await prisma.memberType.findFirst({ where: { id: memberTypeId } }),
    },
  }),
});

export const PostType = new GraphQLObjectType<IPost>({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: { type: UserType as GraphQLOutputType },
  }),
});

export const MemberType = new GraphQLObjectType<IMemberType>({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: { type: new GraphQLList(ProfileType) },
  }),
});
