const { HealthCareProvider, User } = require("../schema");

module.exports = (app) => {
  app.post("/new_health_care", (req, res) => {
    const { authorId, provider_name } = req.body;
    HealthCareProvider.create(req.body, (err, provider) => {
      if (err) return res.json({ error: true, message: "An error occured" });
      if (provider) {
        User.findByIdAndUpdate(
          { _id: authorId },
          { default_room: provider_name },
          (err, user) => {
            res.json({ success: true, provider, user });
          }
        );
      }
    });
  });
};
