'use strict';
import dialogflow from 'dialogflow';
import structJson from './structjson';
const config = require('../config/keys');

import googleAuth from 'google-oauth-jwt';

const projectID = config.googleProjectID;
const credentials = {
	client_email: config.googleClientEmail,
	private_key: config.googlePrivateKey.replace(/\\n/g, '\n') //TODO: Figure out why this is needed for Heroku
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });

module.exports = {
	getToken: async function() {
		return new Promise((resolve) => {
			googleAuth.authenticate(
				{
					email: config.googleClientEmail,
					key: config.googlePrivateKey,
					scopes: [ 'https://www.googleapis.com/auth/cloud-platform' ]
				},
				(err, token) => {
					resolve(token);
				}
			);
		});
	},
	textQuery: async function(text, userID, parameters = {}) {
		let sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: text,
					languageCode: config.dialogFlowSessionLanguageCode
				}
			},
			queryParams: {
				payload: {
					data: parameters
				}
			}
		};
		let responses = await sessionClient.detectIntent(request);
		responses = await self.handleAction(responses);
		return responses;
	},
	eventQuery: async function(event, userID, parameters = {}) {
		let sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				event: {
					name: event,
					parameters: structJson.jsonToStructProto(parameters),
					languageCode: config.dialogFlowSessionLanguageCode
				}
			}
		};
		let responses = await sessionClient.detectIntent(request);
		responses = await self.handleAction(responses);
		return responses;
	},
	handleAction: function(responses) {
		return responses;
	}
};
