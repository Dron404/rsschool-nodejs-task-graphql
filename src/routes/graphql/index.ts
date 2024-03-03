import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
      const queryDoc = parse(req.body.query);

      const errors = validate(schema, queryDoc, [depthLimit(5)]);

      if (errors?.length) {
        return { data: '', errors };
      }

      const data = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
      return data;
    },
  });
};

export default plugin;
