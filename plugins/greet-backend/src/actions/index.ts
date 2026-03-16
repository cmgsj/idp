import type { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { createGreetUserAction } from './createGreetAction';

export const createGreetActions = (options: {
  actionsRegistry: ActionsRegistryService;
}) => {
  createGreetUserAction(options);
};
