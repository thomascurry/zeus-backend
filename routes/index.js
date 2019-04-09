'use strict';

export default (app) => {
	app.get('/api/get_client_token', async (req, res) => {
		let token = await chatbot.getToken();
		res.send({ token });
	});

	app.post('/api/df_text_query', async (req, res) => {
		let responses = await chatbot.textQuery(req.body.text, req.body.userID, req.body.parameters);
		res.send(responses[0].queryResult);
	});

	app.post('/api/df_event_query', async (req, res) => {
		let responses = await chatbot.eventQuery(req.body.event, req.body.userID, req.body.parameters);
		res.send(responses[0].queryResult);
	});
};