module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{json,html,svg,js,css,eot,woff2,woff,ttf}',
  ],
  swDest: 'build\\service-worker.js',
  runtimeCaching: [{
    // Match any same-origin request that contains 'apis'.
    urlPattern: /apis/,
    // Apply a network-first strategy.
    handler: 'networkFirst',
    options: {
      // Fall back to the cache after 10 seconds.
      networkTimeoutSeconds: 10,
      // Use a custom cache name for this route.
      cacheName: 'api-cache',
      // Configure custom cache expiration.
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 600,
      },
      // Configure background sync.
      backgroundSync: {
        name: 'queue-name',
        options: {
          maxRetentionTime: 60 * 60,
        },
      },
      // Configure which responses are considered cacheable.
      cacheableResponse: {
        statuses: [0, 200],
        headers: { 'x-test': 'true' },
      },
      // Configure the broadcast cache update plugin.
      broadcastUpdate: {
        channelName: 'update-channel',
      },
      // matchOptions and fetchOptions are used to configure the handler.
      fetchOptions: {
        mode: 'no-cors',
      },
      matchOptions: {
        ignoreSearch: true,
      },
    },
  }, {
    // To match cross-origin requests, use a RegExp that matches
    // the start of the origin:
    urlPattern: new RegExp('^https://www.googleapis.com/'),
    handler: 'staleWhileRevalidate',
    options: {
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  }],
};
