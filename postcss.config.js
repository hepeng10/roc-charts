var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');

module.exports = {
    plugins: [
        autoprefixer,
        nested()
    ]
};