// MIT License

// Copyright (c) 2016 David Betz

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict"

const url = require('url')

const debug = require('debug')('api')

const memorydb = require('memorydb')
const idgen = memorydb.idgen

const response = require('./response')

module.exports.get = function (req, res) {
    debug("GET /api/samples")
    if (typeof req.user === 'undefined' || typeof req.user._id === 'undefined') {
        return response.send401(res)
    }
    const user_id = req.user._id
    memorydb.getAll(user_id)
        .then(p => response.sendJson(res, 200, p))
        .catch(err => response.routeError(res, err))
}

module.exports.getWithId = function (req, res, next) {
    debug("GET /api/samples/:id")
    if (typeof req.user === 'undefined' || typeof req.user._id === 'undefined') {
        return response.send401(res)
    }
    const user_id = req.user._id
    const session_id = req.params.id
    memorydb.get(user_id, session_id)
        .then(p => response.sendJson(res, 200, p))
        .catch(err => response.routeError(res, err))
}

module.exports.post = function (req, res, next) {
    debug("POST /api/samples")
    if (typeof req.user === 'undefined' || typeof req.user._id === 'undefined') {
        return response.send401(res)
    }
    const user_id = req.user._id
    const session_id = idgen.generate('POST /api/samples' + user_id)
    const item = Object.assign({}, req.body)
    memorydb.insert(user_id, session_id, item)
        .then(p => response.sendJson(res, 200, p))
        .catch(err => response.routeError(res, err))
}

module.exports.deleteWithId = function (req, res, next) {
    debug("DELETE /api/samples/:id")
    if (typeof req.user === 'undefined' || typeof req.user._id === 'undefined') {
        return response.send401(res)
    }
    const user_id = req.user._id
    const session_id = idgen.generate('DELETE /api/samples/:id' + user_id)
    memorydb.delete(user_id, session_id)
        .then(p => response.sendJson(res, 204, {}))
        .catch(err => response.routeError(res, err))
}

module.exports.init = function (app) {
    app.post("/api/samples", module.exports.post)
    app.delete("/api/samples/:id", module.exports.deleteWithId)
    app.get("/api/samples", module.exports.get)
    app.get("/api/samples/:id", module.exports.getWithId)
}