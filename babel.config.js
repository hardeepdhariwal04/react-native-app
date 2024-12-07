module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['react-native-web', { commonjs: true }],
  ],
};

