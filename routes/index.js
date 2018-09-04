var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

function getMultiSelect (value) { //create HubDB acceptable array from multi select field
		var rawValues = value.split(';');
		var values = []
		rawValues.forEach(function(item) {
				values.push({"id":String(item),"type" : "option"});
		});
		return values;
	}


router.get('/update-hubdb',function(req,res,next){
	res.render('index', { title: 'Testing Hugs' });
});

router.post('/update-hubdb', function(req,res,next){
	var auth = req.get("authorization"); //get authorization header 
	var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");

	if (credentials[1]===process.env.WEBHOOK_AUTH_PW){ //HubSpot Workflow webhook can include Basic Auth - set PW in HubSpot and environment var
		var ice_cream = getMultiSelect(_.get(req.body.properties,'ice_cream.value','')); //create HubDB acceptable array from multi select field
		var options = {
				uri: `https://api.hubapi.com/hubdb/api/v1/tables/${process.env.HUBDB_TABLE_ID}/rows?portalId=${process.env.HUB_ID}&hapikey=${process.env.HAPI_KEY}`,
				method: 'POST',
				json: {
					"values": {//key IDs are found in Get HubDB REST call - details https://developers.hubspot.com/docs/methods/hubdb/v2/get_table
						    "2": _.get(req.body.properties,'firstname.value',''),
						    "3": _.get(req.body.properties,'lastname.value', ""),
						    "4": _.get(req.body.properties,'email.value', ""),
						    "5": {"url": _.get(req.body.properties,'headshot.value', ""),"type": "image"},
						    "6": Number(_.get(req.body.properties,'age.value',""))
						    "7": `${ice_cream}`
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
