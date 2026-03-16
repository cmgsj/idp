import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createGreetUserAction = ({
  actionsRegistry,
}: {
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'greet-user',
    title: 'Greet User',
    description: 'Generate a personalized greeting',
    attributes: {
      destructive: false,
      idempotent: true,
      readOnly: true,
    },
    schema: {
      input: (z) =>
        z.object({
          name: z.string().describe('The name of the person to greet'),
        }),
      output: (z) =>
        z.object({
          greeting: z.string().describe('The generated greeting'),
        }),
    },
    action: async ({ input }) => ({
      output: {
        greeting: `Hello ${input.name}!`,
      },
    }),
  });
};
