'use strict';
import dialogflow from 'dialogflow';
import structJson from '../utils/structjson';
import config from '../config/config';

import googleAuth from 'google-oauth-jwt';

const projectID = config.passengers.googleProjectID;
const credentials = {
	client_email: config.passengers.googleClientEmail,
	private_key: config.passengers.googlePrivateKey.replace(/\\n/g, '\n') //TODO: Figure out why this is needed for Heroku
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });

module.exports = {
	getToken: async function() {
		return new Promise((resolve) => {
			googleAuth.authenticate(
				{
					email: config.passengers.googleClientEmail,
					key: config.passengers.googlePrivateKey,
					scopes: [ 'https://www.googleapis.com/auth/cloud-platform' ]
				},
				(err, token) => {
					resolve(token);
				}
			);
		});
	},
	textQuery: async function(text, userID, parameters = {}) {
		let sessionPath = sessionClient.sessionPath(
			config.passengers.googleProjectID,
			config.passengers.dialogFlowSessionID + userID
		);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: text,
					languageCode: config.passengers.dialogFlowSessionLanguageCode
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
		let sessionPath = sessionClient.sessionPath(
			config.passengers.googleProjectID,
			config.passengers.dialogFlowSessionID + userID
		);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				event: {
					name: event,
					parameters: structJson.jsonToStructProto(parameters),
					languageCode: config.passengers.dialogFlowSessionLanguageCode
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
