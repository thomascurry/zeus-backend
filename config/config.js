'use strict';

import yaml from 'js-yaml';
import fs from 'fs';

let loadConfig = (teamName) => {
	try {
		const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/teams/${teamName}.yaml`), 'utf8');
		return config;
	} catch (err) {
		console.error(
			`errors loading config file: ${err}, have you created your team directory under "${__dirname}/teams"?`
		);
	}
};

module.exports = {
	passengers: loadConfig('passengers')
};
