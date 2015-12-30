'use strict';
var db = require('../models/index'),
  logger = require('../../lib/log'),
  _ = require('lodash'),
  request = require('request'),
  URI = require('urijs'),
  CONSTANTS = require('../../lib/constants');

/**
 * @api {post} /demos Create
 * @apiDescription Creates a demo.
 * Creates a demo.
 *
 * @apiVersion 0.0.1
 * @apiName postDemo
 * @apiGroup Demos
 *
 * @apiParam {String} url A valid URL (required).
 * @apiParam {Number} number A number (optional).
 *
 * @apiExample {curl} Example usage:
 * curl -X POST -H "Content-Type: application/json" -d '{
 *     "url": "http://wwwfoobar",
 *     "number": 1
 * }' 'http://localhost:8001/demos'
 *
 * @apiSuccess (Created 201) {Object} demo  Newly created demo object
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 1,
 *   "url": "http://www.foo.bar",
 *   "number": 1,
 *   "updated_at": "2015-12-30T22:19:23.000Z",
 *   "created_at": "2015-12-30T22:19:23.000Z"
 * }
 *
 * @apiError (Error 400) SequelizeValidationError Required field is missing
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "SequelizeValidationError",
 *   "message": "Validation error: Validation isUrl failed",
 *   "errors": [
 *     {
 *       "message": "Validation isUrl failed",
 *       "type": "Validation error",
 *       "path": "url",
 *       "value": "Validation isUrl failed",
 *       "__raw": "Validation isUrl failed"
 *     }
 *   ]
 * }
 *
 */
exports.postDemo = (req, res) => {
  logger.debug('Executing: postDemo. Request body: ' + JSON.stringify(req.body));
  
  db.Demos.create(req.body)
    .then((newDemo) => {
      res.status(201).json(newDemo)
    })
    .catch((error) => {
      logger.warn('Can\'t add a new demo: ' + JSON.stringify(error));
      // send 400 response if it's a sequelize validataion error
      if (error && ( error.name === "SequelizeValidationError" || error.status === 400)) {
        res.status(400).json(error);
      }
      else {
        // generic error
        res.status(500).send(error);
      }
    });
};


/**
 * @api {get} /demos Read All
 * @apiDescription Get all demos. Specify parameters in the query string to limit the query.
 *
 * @apiVersion 0.0.1
 * @apiName getDemos
 * @apiGroup Demos
 *
 * @apiExample {curl} Example usage:
 * curl -X GET 'http://localhost:8001/demos?number=1'
 *
 * @apiSuccess (OK 200) {Object[]} demos  A list of matching demos.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "id": 3,
 *     "url": "http://url.com.me",
 *     "number": 2,
 *     "created_at": "2015-12-30T18:23:54.000Z",
 *     "updated_at": "2015-12-30T18:23:54.000Z"
 *   },
 *   {
 *     "id": 2,
 *     "url": "http://url.com",
 *     "number": 2,
 *     "created_at": "2015-12-30T18:23:39.000Z",
 *     "updated_at": "2015-12-30T18:23:39.000Z"
 *   }
 * ]
 */
exports.getDemos = (req, res)=> {
  logger.debug('Executing: getDemos. Query params: ' + req.query);
  var options = '1 = 1'; //Default value for where clause

  //Set the options to the query params
  if (req.query) {
    options = req.query;
  }

  db.Demos.all({
    order: 'created_at DESC',
    where: options
  })
    .then((demos) => {
      res.status(200).send(demos);
    })
    .catch((error) => {
      logger.warn('Can\'t retrieve all demos, error: ' + JSON.stringify(error));
      res.status(500).send(error);
    });
};

/**
 * @api {get} /demos/:id Read 1
 * @apiDescription Get a demo with a specified id.
 *
 * @apiVersion 0.0.1
 * @apiName getOneDemo
 * @apiGroup Demos
 *
 * @apiExample {curl} Example usage:
 * curl -X GET 'http://localhost:8001/demos/2'
 *
 * @apiSuccess (OK 200) {Object} demoObject  A demo object.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 2,
 *   "url": "http://url.com",
 *   "number": 2,
 *   "created_at": "2015-12-30T18:23:39.000Z",
 *   "updated_at": "2015-12-30T18:23:39.000Z"
 * }
 *
 * @apiError (Error 404) NotFound Demo not found.
 * @apiErrorExample {text} Error-Response:
 * HTTP/1.1 404 Not Found
 * demo with id: 0 not found
 */
exports.getOneDemo = (req, res) => {
  logger.debug('Executing: getOneDemo. ID: ' + req.params.id);
  db.Demos.findById(req.params.id)
    .then((demo) => {
      if (!demo || demo.length < 1) {
        res.status(404).send('demo with id: ' + req.params.id + ' not found');
        return;
      }
      res.status(200).send(demo);

    })
    .catch((error) => {
      logger.warn('Can\'t get demo with id:' + req.params.run + ', error: ' + JSON.stringify(error));
      res.status(500).send(error);
    });
};

/**
 * @api {put} /demos/:id Update
 * @apiDescription Update a demo
 *
 * @apiVersion 0.0.1
 * @apiName putDemo
 * @apiGroup Demos
 *
 * @apiExample {curl} Example usage:
* curl -X PUT -H "Content-Type: application/json" -d '{
*     "url": "http://hello.world"
* }' 'http://localhost:8001/demos/2'
 *
 * @apiSuccess (OK 200) {Object} updatedDemo Updated demo
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 2,
 *   "url": "http://hello.world",
 *   "number": 2,
 *   "created_at": "2015-12-30T18:23:39.000Z",
 *   "updated_at": "2015-12-30T22:42:11.000Z"
 * }
 *
 * @apiError (Error 400) BadRequest Invalid value for a passed key
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "SequelizeValidationError",
 *   "message": "Validation error: Validation isUrl failed",
 *   "errors": [
 *     {
 *       "message": "Validation isUrl failed",
 *       "type": "Validation error",
 *       "path": "url",
 *       "value": "Validation isUrl failed",
 *       "__raw": "Validation isUrl failed"
 *     }
 *   ],
 *   "status": 400
 * }
 */
exports.putDemo = (req, res) => {
  logger.debug('Executing: putDemo. ID: ' + req.params.id);
  db.Demos.findById(req.params.id)
    .then((demo) => {
      if (!demo) {
        logger.warn("demo with id: " + req.params.id + " not found");
        return Promise.reject({
          message: "demo with id: " + req.params.id + " not found",
          status: 404
        });
      }
      return demo.updateAttributes(req.body);
    })
    .then((updatedDemo) => {
      res.status(200).json(updatedDemo);
    })
    .catch((error) => {
      if (error && error.name === "SequelizeValidationError") {
        error.status = 400;
      }
      else if (!error) {
        error = {
          message: 'Can\'t update a demo: ' + req.params.id,
          error: error,
          status: 500
        };
      }
        
      logger.warn(error);

      res.status(error.status || 500).json(error);
    });
};



/**
 * @api {delete} /demos/:id Delete
 * @apiDescription Delete a demo
 *
 * @apiVersion 0.0.1
 * @apiName deleteOneDemo
 * @apiGroup Demos
 *
 * @apiExample {curl} Example usage:
 * curl -X DELETE -d '' 'http://localhost:8001/demos/2'
 *
 * @apiSuccess (OK 200) {Object} deletedDemo Deleted demo
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 2,
 *   "url": "http://hello.world",
 *   "number": 2,
 *   "created_at": "2015-12-30T18:23:39.000Z",
 *   "updated_at": "2015-12-30T22:42:11.000Z"
 * }
 *
 * @apiError (Error 404) NotFound Demo doesn't exist
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "message": "demo with id: 2 not found",
 *   "status": 404
 * }
 */
exports.deleteDemo = (req, res) => {
  logger.debug('Executing: deleteDemo. ID: ' + req.params.id);
  db.Demos.findById(req.params.id)
    .then((demo) => {
      if (!demo) {
        logger.warn("demo with id: " + req.params.id + " not found");
        return Promise.reject({message: "demo with id: " + req.params.id + " not found", status: 404});
      }
      return demo.destroy();
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      if (error && error.status === 404) {
        res.status(404);
      }
      else {
        res.status(500);
        error = {
          message: "Can't delete a demo with id: " + req.params.id,
          error: error,
          status: 500
        }
      }
      logger.warn(error);
      res.json(error);
    });
};

