const router = require('express').Router();
const countryController = require('../controllers/countryController');
const foodController = require('../controllers/foodController');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const jwt = require('jsonwebtoken');

function secureRoute(req, res, next) {
  if (!req.headers.authorization)
    res.status(401).json({ message: 'unauthorised'});
  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, 'doris', function(err) {
    if(err){
      res.status(401).json({ message: 'Unauthorised!' });
    } else {
      req.tokenUserId = jwt.decode(token).sub;
      next();
    }
  });
}

router.route('/register')
  .post(authController.registerRoute);

router.route('/login')
  .post(authController.loginRoute);

router.route('/countries')
  .get(countryController.countryIndexRoute)
  .post(secureRoute, countryController.countryCreateRoute);

router.route('/countries/:id')
  .get(countryController.countryShowRoute)
  .put(secureRoute, countryController.countryUpdateRoute)
  .delete(secureRoute, countryController.countryDeleteRoute);

router.route('/countries/:countryId')
  .post(secureRoute, foodController.foodCreateRoute);

router.route('/foods')
  .get(foodController.foodIndexRoute);

router.route('/foods/:id')
  .get(foodController.foodShowRoute)
  .put(secureRoute, foodController.foodUpdateRoute)
  .delete(secureRoute, foodController.foodDeleteRoute);

router.route('/foods/:foodId/comments')
  .post(secureRoute, commentController.createRoute);

router.route('/foods/:foodId/comments/:commentId')
  .delete(commentController.deleteRoute);

module.exports = router;
