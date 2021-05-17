const { HealthCareProvider } = require("../schema");

module.exports = (app) => {
  app.get("/health_care_providers/:type", (req, res) => {
    const type = req.params.type;
    console.log(type);
    HealthCareProvider.find()
      .where({ type: type })
      .exec((err, providers) => {
        console.log(providers);
        if (err) return res.json({ error: true, message: "An error occured" });

        res.json({ success: true, providers });
      });
  });
};
