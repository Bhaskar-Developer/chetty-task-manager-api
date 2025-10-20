module.exports = {
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "node": "14"
      }
    }]
  ],
  env: {
    test: {
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "node": "current"
          }
        }]
      ]
    }
  }
};