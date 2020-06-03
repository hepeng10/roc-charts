const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss'],
        alias: {
            '@': resolve('src'),
            '@images': resolve('src/images'),
            '@styles': resolve('src/styles'),
            '@utils': resolve('src/utils'),
        }
    },
};
