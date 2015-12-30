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
 *   "url": "http://www.google.com",
 *   "number": 1,
 * }' 'http://localhost:8001/demos'
 *
 * @apiSuccess (Created 201) {Object} demo  Newly created demo object
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 * }
 *
 * @apiError (Error 400) SequelizeValidationError Required field is missing
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "SequelizeValidationError",
 *   "message": "notNull Violation: url cannot be null",
 *   "errors": [
 *     {
 *       "message": "url cannot be null",
 *       "type": "notNull Violation",
 *       "path": "url",
 *       "value": null
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
 * curl -X GET 'http://localhost:8001/demos?title=foo'
 *
 * @apiSuccess (OK 200) {Object[]} demos  A list of demos.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * ]
 */
exports.getDemos = (req, res)=> {
  logger.debug('Executing: getDemos');
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
 * curl -X GET 'http://localhost:8001/demos/1'
 *
 * @apiSuccess (OK 200) {Object} runObject  A run object.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "title": "Foo",
 *   "comment": "test demo",
 *   "created_at": "2015-12-08T17:15:44.000Z",
 *   "updated_at": "2015-12-08T17:15:44.000Z"
 * }
 *
 * @apiError (Error 404) NotFound Demo not found.
 * @apiErrorExample {text} Error-Response:
 * HTTP/1.1 404 Not Found
 * demo with id: 0 not found
 */
exports.getOneDemo = (req, res) => {
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
 *     "url": "http://www.google.com"
 *     "number": 2
 * }' 'http://localhost:8001/demo/1'
 *
 * @apiSuccess (OK 200) {Object} updatedDemo Updated demo
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "url": "http://www.google.com"
 *   "number": 2
 *   "created_at": "2015-12-08T17:15:44.000Z",
 *   "updated_at": "2015-12-08T21:42:25.000Z"
 * }
 *
 * @apiError (Error 400) BadRequest Invalid value for a passed key
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "name": "SequelizeValidationError",
 *   "message": "notNull Violation: title cannot be null",
 *   "errors": [
 *     {
 *       "message": "title cannot be null",
 *       "type": "notNull Violation",
 *       "path": "title",
 *       "value": null
 *     }
 *   ]
 * }
 */
exports.putDemo = (req, res) => {
  logger.debug('Executing: putDemo');
  db.Demos.findById(req.params.id)
    .then((demo) => {
      if (!demo) {
        logger.warn("demo with id: " + req.params.id + " not found");
        return Promise.reject({message: "demo with id: " + req.params.id + " not found", status: 404});
      }
      return demo.updateAttributes(req.body)
    })
    .then((updatedDemo) => {
      res.status(200).send(updatedDemo);
    })
    .catch((error) => {
      if (error && error.name === "SequelizeValidationError") {
        res.status(400);
      }
      else if (error && error.status === 404) {
        res.status(404);
      }
      else {
        res.status(500);
        error = {
          message: 'Can\'t update a demo: ' + req.params.id,
          error: error
        }
      }
      logger.warn(error);
      res.json(error);
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
 * curl -X DELETE -d '' 'http://localhost:8001/demos/1'
 *
 * @apiSuccess (OK 200) {Object} deletedDemo Deleted demo
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "title": "hello world!",
 *   "comment": "test demo",
 *   "created_at": "2015-12-08T17:15:44.000Z",
 *   "updated_at": "2015-12-08T17:42:25.000Z"
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
  logger.debug('Executing: deleteOneDemo with id: ' + req.params.id);
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

