import { ApolloProvider } from '@apollo/client/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { apolloClient } from './apollo/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import { Auth0ProviderWithNavigate } from './auth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* You connect Apollo Client to React with the ApolloProvider component */}
    {/* Router first: Auth0ProviderWithNavigate uses useNavigate for the redirect callback. */}
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>,
);
