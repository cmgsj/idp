import { createApp } from '@backstage/frontend-defaults';
import { navModule } from './modules/nav';
import { signInModule } from './modules/signin';

export default createApp({
  features: [signInModule, navModule],
});
