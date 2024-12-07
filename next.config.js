const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "react-native",
    "react-native-web",
    "expo",
    // Add more React Native / Expo packages here...
  ],
  experimental: {
    forceSwcTransforms: true,
  },
});
const withTM = require('next-transpile-modules')([
  'react-native',
  '@react-native-picker/picker',
]);

module.exports = withTM({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      './Libraries/ActionSheetIOS/ActionSheetIOS$': false,
    };
    return config;
  },
});

module.exports = nextConfig;
