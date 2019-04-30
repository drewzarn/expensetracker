const path = require('path');

module.exports = {
  mode: "development", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: "./src", // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, ""), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "main.js", // string
    // the filename template for entry chunks
    
  }
}