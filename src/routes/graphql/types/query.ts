import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLOutputType, GraphQLList } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import {
  MemberType,
  MemberTypeIdType,
  PostType,
  ProfileType,
  UserType,
} from './gcl-types.js';
import { UUIDType } from './uuid.js';
import prisma from '../prisma.service.js';



export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: {
      type: MemberType as GraphQLOutputType,
      args: { id: { type: MemberTypeIdType } },
      resolve: async (_parent, { id }: { id: MemberTypeId }) =>
        await prisma.memberType.findUnique({ where: { id } }),
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => await prisma.memberType.findMany(),
    },

    post: {
      type: PostType as GraphQLOutputType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, { id }: { id: string }) => {
        const result = await prisma.post.findUnique({ where: { id } });
        return result;
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {
        const result = await prisma.post.findMany();
        return result;
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        const result = await prisma.user.findMany();
        return result;
      },
    },

    user: {
      type: UserType as GraphQLOutputType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, { id }: { id: string }) =>
        await prisma.user.findUnique({ where: { id } }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => await prisma.profile.findMany(),
    },

    profile: {
      type: ProfileType as GraphQLOutputType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, { id }: { id: string }) => {
        const result = await prisma.profile.findUnique({ where: { id } });
        return result;
      },
    },
  },
});
