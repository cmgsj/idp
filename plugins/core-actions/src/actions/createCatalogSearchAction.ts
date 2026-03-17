import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export const createCatalogSearchAction = ({
  discovery,
  auth,
  actionsRegistry,
}: {
  discovery: DiscoveryService;
  auth: AuthService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: `search-catalog`,
    title: `Search Catalog`,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Search the Backstage catalog for entities. Results are ordered by relevance to the query.

Responses are paginated. To get the next page, pass the "nextPageCursor" value as the "pageCursor" parameter to the tool again.

DO NOT try to filter on kinds in the query string, always use the "kinds" parameter.
`,
    schema: {
      input: (z) =>
        z.object({
          query: z.string().describe('Search query'),
          kinds: z
            .string()
            .describe(
              'Comma-separated list of Backstage entity kinds. If not specified then all kinds are searched.',
            )
            .optional(),
          pageLimit: z
            .number()
            .describe('Number of results to return per page')
            .optional()
            .default(10),
          pageCursor: z
            .string()
            .describe('Cursor for the next page')
            .optional(),
        }),
      output: (z) =>
        z.object({
          response: z.string().describe('Natural language response'),
        }),
    },
    action: async ({ input, credentials }) => {
      const filters: string[] = [];

      const { kinds, pageCursor, query, pageLimit } = input;

      if (kinds) {
        kinds.split(',').forEach((kind: string) => {
          filters.push(`filters[kind]=${kind}`);
        });
      }

      let fullQuery = `types[0]=software-catalog&term=${query}&pageLimit=${pageLimit}`;

      if (pageCursor) {
        fullQuery += `&pageCursor=${pageCursor}`;
      }

      if (filters.length > 0) {
        fullQuery += `&${filters.join('&')}`;
      }

      const url = `${await discovery.getBaseUrl('search')}/query?${fullQuery}`;
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'search',
      });
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return { output: { response: await response.text() } };
    },
  });
};
