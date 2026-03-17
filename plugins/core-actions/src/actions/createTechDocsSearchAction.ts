import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import type { SearchResultSet } from '@backstage/plugin-search-common';

export const createTechDocsSearchAction = ({
  discovery,
  auth,
  actionsRegistry,
}: {
  discovery: DiscoveryService;
  auth: AuthService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: `search-techdocs`,
    title: `Search TechDocs`,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description:
      'Searches the Backstage TechDocs internal documentation for the organization.',
    schema: {
      input: (z) =>
        z.object({
          query: z.string().describe('Search query'),
          pageLimit: z
            .number()
            .describe('Number of results to return per page')
            .optional()
            .default(5),
          pageCursor: z
            .string()
            .describe('Cursor for the next page')
            .optional(),
        }),
      output: (z) => z.object({}).passthrough(),
    },
    action: async ({ input, credentials }) => {
      const { pageCursor, query, pageLimit } = input;

      let fullQuery = `types[0]=techdocs&term=${query}&pageLimit=${pageLimit}`;

      if (pageCursor) {
        fullQuery += `&pageCursor=${pageCursor}`;
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
      const payload = (await response.json()) as SearchResultSet;

      return {
        output: {
          nextPageCursor: payload.nextPageCursor,
          results: payload.results.map((result) => ({
            location: result.document.location,
            title: result.document.title,
            text: result.document.text,
          })),
        },
      };
    },
  });
};
