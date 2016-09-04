'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cdn Schema
 */
var CdnSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Cdn name',
    trim: true
  },
  url: {
    type: String,
    default: '',
    required: 'Please fill Cdn url',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Cdn description',
    trim: true
  },
  version: {
    type: String,
    default: '',
    required: 'Please fill Cdn version',
    trim: true
  },
  type: {
    type: String,
    default: '',
    required: 'Please fill Cdn type',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cdn', CdnSchema);
