import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLOutputType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from './uuid.js';
import prisma from '../prisma.service.js';
import {
  IUser,
  ISubscribersOnAuthors,
  IMemberType,
  IPost,
  IProfile,
} from './interfaces.js';

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
    id: { type: UUIDType },
    authorId: { type: new GraphQLNonNull(UUIDType) },
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

export const createPostType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const createUserType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createProfileType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const changeUserType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const changePostType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
  }),
});

export const changeProfileType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
  }),
});

export const SubscribeInput = new GraphQLInputObjectType({
  name: 'SubscribeInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  },
});
