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

class Request {
    constructor(options) {
        this.body = {}
        this.params = {}
        const optionsCopy = Object.assign({}, options)
        for (let name in options) {
            this[name] = optionsCopy[name]
        }
    }
}

class Response {
    constructor() {
        /* istanbul ignore next */
        this.done = () => { }
    }

    setDone(func) {
        this.done = func
    }

    set(name, value) {
        this.hash = this.hash || {}
        this.hash[name] = value
    }

    status(code) {
        const self = this
        this.code = code
        return {
            json: (json_obj) => {
                self.send_obj = undefined
                self.json_obj = json_obj
                self.done(this)
            }
        }
    }

    send(send_obj) {
        this.json_obj = undefined
        this.send_obj = send_obj
        this.done(this)
    }
}

function createRequest(options) {
    let req = new Request(options)
    if (typeof req.url === 'undefined') {
        throw new Error('req.url is required')
    }
    return req
}

function createResponse() {
    return new Response()
}

module.exports.createResponse = createResponse
module.exports.createRequest = createRequest
module.exports.idgen = require('./idgen')