var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-rgba2hex";

function rgbaToHex(rgba) {
	var color = rgba.toString().split(",");
	return color && color.length === 4
		? "#" +
				("0" + parseInt(parseFloat(color[3]) * 255, 10).toString(16)).slice(
					-2
				) +
				("0" + parseInt(color[0], 10).toString(16)).slice(-2) +
				("0" + parseInt(color[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(color[2], 10).toString(16)).slice(-2)
		: "";
}

var rgbaMatch = function(css) {
	return css.replace(/rgba\(.*?\)/g, function(match, $1) {
		return rgbaToHex($1);
	});
};

function gulpPrefixer() {
	var stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit(
				"error",
				new PluginError(PLUGIN_NAME, "Streams are not supported!")
			);
			return cb();
		}

		if (file.isBuffer()) {
			file.contents = new Buffer(rgbaMatch(file.contents.toString()));
		}

		this.push(file);

		cb();
	});

	return stream;
}

module.exports = gulpPrefixer;
