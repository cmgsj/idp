import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createGreetActions } from './actions';

/**
 * greetPlugin backend plugin
 *
 * @public
 */
export const greetPlugin = createBackendPlugin({
  pluginId: 'greet',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
      },
      async init({ actionsRegistry }) {
        createGreetActions({ actionsRegistry });
      },
    });
  },
});
