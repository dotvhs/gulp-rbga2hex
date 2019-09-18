var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-rgba2hex";

function rgbaToHex(rgba, options) {
	var color = rgba.toString().split(",");
	var varAlpha = (
		"0" + parseInt(parseFloat(color[3]) * 255, 10).toString(16)
	).slice(-2);
	var setARGB = !options.rgba ? varAlpha : "";
	var setRGBA = options.rgba ? varAlpha : "";
	return (
		"#" +
		setARGB +
		("0" + parseInt(color[0], 10).toString(16)).slice(-2) +
		("0" + parseInt(color[1], 10).toString(16)).slice(-2) +
		("0" + parseInt(color[2], 10).toString(16)).slice(-2) +
		setRGBA
	);
}

function injectDefaultOptions(options) {
	options = options || {};
	options.rgba = options.rgba || false;
	return options;
}

var rgbaMatch = function(css, options) {
	return css.replace(/rgba\((.*)?\)/g, function(match, $1) {
		return rgbaToHex($1, options).toString();
	});
};

function gulpPrefixer(options) {
	options = injectDefaultOptions(options);
	var stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit(
				"error",
				new PluginError(PLUGIN_NAME, "Streams are not supported!")
			);
			return cb();
		}

		if (file.isBuffer()) {
			file.contents = new Buffer(rgbaMatch(file.contents.toString(), options));
		}

		this.push(file);

		cb();
	});

	return stream;
}
module.exports = function(options) {
	options = injectDefaultOptions(options);

	return gulpPrefixer(options);
};
