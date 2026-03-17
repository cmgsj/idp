import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { createCatalogSearchAction } from './createCatalogSearchAction';
import { createTechDocsReadAction } from './createTechDocsReadAction';
import { createTechDocsSearchAction } from './createTechDocsSearchAction';

export const createCoreActions = (options: {
  discovery: DiscoveryService;
  auth: AuthService;
  actionsRegistry: ActionsRegistryService;
}) => {
  createCatalogSearchAction(options);
  createTechDocsSearchAction(options);
  createTechDocsReadAction(options);
};
