import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import {
  PostType,
  SubscribeInput,
  SubscribersOnAuthorsType,
  UserType,
  changePostType,
  changeProfileType,
  changeUserType,
  createPostType,
  createProfileType,
  createUserType,
} from './gcl-types.js';
import prisma from '../prisma.service.js';
import { Prisma } from '@prisma/client';
import { UUIDType } from './uuid.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',

  fields: () => ({
    createPost: {
      type: PostType,
      args: { dto: { type: createPostType } },
      resolve: async (_parent, { dto }: { dto: Prisma.PostCreateInput }) =>
        await prisma.post.create({ data: dto }),
    },

    createUser: {
      type: UserType as GraphQLObjectType,
      args: { dto: { type: createUserType } },
      resolve: async (_parent, { dto }: { dto: Prisma.UserCreateInput }) =>
        await prisma.user.create({ data: dto }),
    },

    createProfile: {
      type: PostType,
      args: { dto: { type: createProfileType } },
      resolve: async (_parent, { dto }: { dto: Prisma.ProfileUncheckedCreateInput }) =>
        await prisma.profile.create({ data: dto }),
    },

    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: Prisma.PostWhereUniqueInput) => {
        try {
          await prisma.post.delete({ where: args });
          return true;
        } catch {
          return false;
        }
      },
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: Prisma.UserWhereUniqueInput) => {
        try {
          await prisma.user.delete({ where: args });
          return true;
        } catch {
          return false;
        }
      },
    },

    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: Prisma.ProfileWhereUniqueInput) => {
        try {
          await prisma.profile.delete({ where: args });
          return true;
        } catch {
          return false;
        }
      },
    },

    changeUser: {
      type: UserType as GraphQLObjectType,
      args: { dto: { type: changeUserType }, id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _parent,
        { id, dto }: { dto: Prisma.UserUpdateInput; id: string },
      ) => await prisma.user.update({ where: { id }, data: dto }),
    },

    changePost: {
      type: PostType as GraphQLObjectType,
      args: { dto: { type: changePostType }, id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _parent,
        { id, dto }: { dto: Prisma.PostUpdateInput; id: string },
      ) => await prisma.post.update({ where: { id }, data: dto }),
    },

    changeProfile: {
      type: PostType as GraphQLObjectType,
      args: {
        dto: { type: changeProfileType },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { id, dto }: { dto: Prisma.ProfileUpdateInput; id: string },
      ) => await prisma.profile.update({ where: { id }, data: dto }),
    },

    subscribeTo: {
      type: SubscribersOnAuthorsType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
      ) =>
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        }),
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return true;
      },
    },
  }),
});
