import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

export const createTechDocsReadAction = ({
  discovery,
  auth,
  actionsRegistry,
}: {
  discovery: DiscoveryService;
  auth: AuthService;
  actionsRegistry: ActionsRegistryService;
}) => {
  const turndownService = new TurndownService();

  actionsRegistry.register({
    name: `read-techdocs`,
    title: `Read TechDocs`,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Reads a specific page of Backstage TechDocs technical documentation and returns the content.

The location parameter can be found in TechDocs search results.

Alternatively the path to the root documentation page of a Backstage entity can be constructed as follows:

/docs/<namespace>/<kind>/<name>/

The response will be formatted as Markdown.`,
    schema: {
      input: (z) =>
        z.object({
          location: z.string().describe('Location path of the documentation'),
        }),
      output: (z) => z.object({}).passthrough(),
    },
    action: async ({ input, credentials }) => {
      const url = new URL(
        `${await discovery.getBaseUrl('techdocs')}/static${input.location}`,
      );

      const pageUrl = `${url.origin}${url.pathname}`;

      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'techdocs',
      });
      const response = await fetch(
        `${pageUrl.endsWith('/') ? pageUrl : `${pageUrl}/`}index.html`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const html = await response.text();

      const root = parse(html);

      const container = root.querySelector('.md-content');

      if (!container) {
        throw new Error('Failed to parse TechDocs page');
      }

      return {
        output: { content: turndownService.turndown(container.outerHTML) },
      };
    },
  });
};
