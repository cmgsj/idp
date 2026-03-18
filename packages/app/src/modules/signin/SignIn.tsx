import { SignInPage } from '@backstage/core-components';
import { githubAuthApiRef } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';

export const SignIn = SignInPageBlueprint.make({
  params: {
    loader: async () => (props) => (
      <SignInPage
        {...props}
        auto
        provider={{
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }}
      />
    ),
  },
});
