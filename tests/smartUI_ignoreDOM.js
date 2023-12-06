var https = require("https");
var lambdaRestClient = require("@lambdatest/node-rest-client");
var lambdaCredentials = {
  username: process.env.LT_USERNAME,
  accessKey: process.env.LT_ACCESS_KEY
};
var lambdaAutomationClient = lambdaRestClient.AutomationClient(
  lambdaCredentials
);
module.exports = {
  "@tags": ["test"],
  SmartUI_Test: function(client) {    
    client
      .url("https://time.is/")
      .waitForElementPresent("body", 1000)
      .pause(1000)
      .executeScript(`smartui.takeScreenshot,{\"screenshotName\":\"Ignoring Dynamic Data\",\"ignoreDOM\":{\"id\":[\"clock0_bg\",\"favs\"]}}`)
      .pause(1000)
      .end();  
 
  },
  after: function(browser) {
    console.log("Closing down...");
  },
  afterEach: function(client, done) {
    if (
      process.env.LT_USERNAME &&
      process.env.LT_ACCESS_KEY &&
      client.capabilities &&
      client.capabilities["webdriver.remote.sessionid"]
    ) {
      
      lambdaAutomationClient.updateSessionById(
        client.capabilities["webdriver.remote.sessionid"],
        { status_ind: client.currentTest.results.failed ? "failed" : "passed" },
        function(error, session) {
          console.log(error)
          if (!error) {
            client.pause(1000)
            done();
          }
        }
      );
    } else {
      console.log("Test Run Successfully!");
      client.pause(1000)
      done();
    }
  }
};
