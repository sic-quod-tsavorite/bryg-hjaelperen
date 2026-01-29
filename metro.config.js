const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Force Metro to use CommonJS version of zustand (avoids import.meta issues on web)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    if (moduleName === 'zustand') {
      return context.resolveRequest(context, 'zustand/index.js', platform);
    }
    if (moduleName === 'zustand/middleware') {
      return context.resolveRequest(context, 'zustand/middleware.js', platform);
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
