import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createCoreActions } from './actions';

/**
 * coreActionsPlugin backend plugin
 *
 * @public
 */
export const coreActionsPlugin = createBackendPlugin({
  pluginId: 'core-actions',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        actionsRegistry: actionsRegistryServiceRef,
      },
      async init({ discovery, auth, actionsRegistry }) {
        createCoreActions({ discovery, auth, actionsRegistry });
      },
    });
  },
});
