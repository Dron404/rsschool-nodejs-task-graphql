import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const data = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
      console.log(
        '================================================================================================================================',
      );
      console.log(req.body.query);
      console.log('DATA---------------------------------------');
      console.log(data);
      console.log(req.body.variables);

      console.log(
        '================================================================================================================================',
      );

      return data;
    },
  });
};

export default plugin;
