exports.setupCss = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          // If include isn't set,
          // Webpack will traverse all files within the base directory.
          include: paths
        }
      ]
    }
  };
};
