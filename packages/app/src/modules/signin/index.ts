import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignIn } from './SignIn';

export const signInModule = createFrontendModule({
  pluginId: 'app',
  extensions: [SignIn],
});
