const { withAndroidStyles } = require('@expo/config-plugins');

const withLightTheme = (config) => {
  return withAndroidStyles(config, (modConfig) => {
    const styles = modConfig.modResults;

    if (!styles?.resources?.style) {
      return modConfig;
    }

    const appThemeIndex = styles.resources.style.findIndex(
      (style) => style.$?.name === 'AppTheme'
    );

    if (appThemeIndex !== -1) {
      styles.resources.style[appThemeIndex].$.parent =
        'Theme.AppCompat.Light.NoActionBar';
    }

    return modConfig;
  });
};

module.exports = {
  expo: {
    name: 'example',
    slug: 'example',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.example',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.anonymous.example',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-font',
      'expo-web-browser',
      [
        'expo-asset',
        {
          assets: ['./assets/rive'],
        },
      ],
      withLightTheme,
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
