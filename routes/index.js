var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

function getMultiSelect (value) {
		var rawValues = value.split(';');
		var values = []
		rawValues.forEach(function(item) {
				values.push({"id":String(item),"type" : "option"});
		});
		return values;
	}


router.get('/update-hug-leader',function(req,res,next){
	res.render('index', { title: 'Testing Hugs' });
});

router.post('/update-hug-leader', function(req,res,next){
	var auth = req.get("authorization");
	var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");

	if (credentials[1]===process.env.WEBHOOK_AUTH_PW){
		var areas_of_expertise = getMultiSelect(_.get(req.body.properties,'areas_of_expertise.value',''));
		var options = {
				uri: `https://api.hubapi.com/hubdb/api/v1/tables/${process.env.HUBDB_TABLE_ID}/rows?portalId=${process.env.HUB_ID}&hapikey=${process.env.HAPI_KEY}`,
				method: 'POST',
				json: {
					"values": {
						    "1":_.get(req.body.properties,'hug_city.value',''),
						    "2": _.get(req.body.properties,'firstname.value',''),
						    "3": _.get(req.body.properties,'lastname.value', ""),
						    "5": _.get(req.body.properties,'hug_page_contact_email.value',''),
						    "8": _.get(req.body.properties,'twitterhandle.value',""),
						    "9": _.get(req.body.properties,'facebook_or_linkedin_link_.value',""),
						    "10": _.get(req.body.properties,'hug_leader_since_year_.value', ""),
						    "11": {"url": _.get(req.body.properties,'hug_leader_profile_picture.value', ""),"type": "image"},
						    "13": _.get(req.body.properties,'hug_portal_link.value', ""),
						    "14": Number(_.get(req.body.properties,'hug_event_date.value',"")),
						    "15": _.get(req.body.properties,'hug_event_topic.value',""),
						    "16": _.get(req.body.properties,'hug_event_description.value',""),
						    "27": _.get(req.body.properties,'hug_secondary_hug_leader.value',""),
						    "29": areas_of_expertise,
						    "30": _.get(req.body.properties,'hug_leader_bio.value', ""),
						    "31": _.get(req.body.properties,'hug_overview.value',""),
						    "32": _.get(req.body.properties,'event_registration_link.value',"")
					}
				}
			};
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
			}
			else{
				console.log(response.status,body);
			}
		});
		res.status(200).send('OK');
	}
	else {
      // The user typed in the username or password wrong.
      return res.status(403).send("Access Denied (incorrect credentials)");
    }
});


module.exports = router;
