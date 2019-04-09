'use strict';

import yaml from 'js-yaml';
import fs from 'fs';

let loadConfig = (teamName) => {
	try {
		const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/${teamName}.yml`), 'utf8');
	} catch (err) {
		console.log(
			`errors loading config file: ${err}, have you created your team directory under "${__dirname}/teams"?`
		);
	}
};

module.exports = {
	passengers: loadConfig('passengers')
};
