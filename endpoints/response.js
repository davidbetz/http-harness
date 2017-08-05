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

/* istanbul ignore next */
const sendJson = (res, status, obj) => {
    res.status(status).json(obj)
}

/* istanbul ignore next */
const sendError = (res, err) => {
    res.status(500).json({ "error": typeof err === 'string' ? err : JSON.stringify(err) })
}

/* istanbul ignore next */
const sendRaw = (res, status, obj) => {
    res.set('Content-Type', 'text/plain')
    res.status(status)
    res.send(obj.toString())
}

/* istanbul ignore next */
const send404 = (res) => res.status(404).json({ "error": "not found" })

/* istanbul ignore next */
const send401 = (res) => res.status(401).json({ "error": "unauthorized access" })

/* istanbul ignore next */
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

module.exports = { sendRaw, sendJson, sendError, send404, send401, routeError }