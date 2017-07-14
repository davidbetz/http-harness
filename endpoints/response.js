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

const sendJson = (res, status, obj) => {
    res.status(status).json(obj)
}

const sendError = (res, err) => {
    res.status(500).json({ "error": typeof err === 'string' ? err : JSON.stringify(err) })
}

const sendRaw = (res, status, obj) => {
    res.set('Content-Type', 'text/plain')
    res.status(status)
    res.send(obj.toString())
}

const send404 = (res) => res.status(404).json({ "error": "not found" })

const send401 = (res) => res.status(401).json({ "error": "unauthorized access" })

const routeError = (res, err) => {
    if (err === 401) {
        send401(res)
    }
    else if (err === 404) {
        send404(res)
    }
    else {
        sendError(res, err)
    }
}

module.exports.sendRaw = sendRaw
module.exports.sendJson = sendJson
module.exports.sendError = sendError
module.exports.send404 = send404
module.exports.send401 = send401
module.exports.routeError = routeError