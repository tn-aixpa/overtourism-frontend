export const environment = {
  production: false,
  apiBaseUrl: (window as any)['env']['apiBaseUrl'] || 'https://overtourism.digitalhub-test.smartcommunitylab.it/api/v1'
};