var compression = require('compression')
// const info = require("debug")('info')
const express = require('express');
const rateLimit = require("express-rate-limit");
const { NODE_ENV } = process.env

/**
  @function https
  @param {Object} req Express request
  @param {Object} res Express response
  @param {Object} next Callback
  @returns {Function} The callback
*/
function https(req, res, next) {
  if (NODE_ENV !== "production") {
    return next()
  }
  if (req.secure) {
    return next()
  }
  // console.log(req)
  return res.redirect("https://" + req.hostname + req.url);
}

/**
  @function headers
  @param {Object} req Express request
  @param {Object} res Express response
  @param {Object} next Callback
  @returns {Function} The callback
*/
function headers(req, res, next) {
  res.set({
    "X-Download-Options": "noopen",
    "X-XSS-Protection": '0', // CSP instead
    "Content-Security-Policy":
      // Main form
      "form-action 'self'; " +
      // https
      // "upgrade-insecure-requests; " +
      // bootstrap and local
      "default-src 'self' stackpath.bootstrapcdn.com"
  })
  next();
}

/**
  @function security
  @param {Object} app Express app
  @returns {Function} Middleware func
*/
function security(app, https) {
  // no DoS/DDoS shutdown
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  }))
  app.disable('x-powered-by')

  // Safety headers
  app.use(headers)

  // HTTPS only
  // Keep the site up
  https ? app.use(https)
}

/**
  @function config
  @param {Object} app Express app
  @returns {null} Returns config for app
*/
function config(app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  // Heroku doesn't lie
  app.set("trust proxy");

  // Minify files
  app.use(compression())
}

exports.security = security;
exports.https = https;
// eslint-disable-next-line no-multi-assign
exports = module.exports = (app, https=true) => {
  config(app)
  security(app, https)
}

exports.config = config;
exports.security = security;
