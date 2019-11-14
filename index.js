"use strict";
const request = require("superagent");
const calculator = require("./aqi");

const AIRVISUAL_URL = process.env.AIRVISUAL_URL;
const SLACK_HOOK = process.env.SLACK_HOOK;

(async () => {
  try {
    const res = await request(AIRVISUAL_URL).timeout(5000);
    if (res.body.current) {
      const { tp, hm, p2 } = res.body.current;
      const { aqi, label } = calculator(p2);

      await request
        .post(SLACK_HOOK)
        .set({ "Content-type": "application/json" })
        .send({
          text: `Todays Forecast\n>Air Quality: *${aqi} - ${label}*\n>Temperature: *${parseFloat(
            tp
          ).toFixed(0)} °C*\n>Humidity: *${hm}%*`
        });
    }
  } catch (ex) {
    console.error(ex);
  }
})();
