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

const expect = require('chai').expect
const assert = require('chai').assert

const debug = require('debug')('test')

const httpHarness = require('../http-harness')
const idgen = require('../idgen')

const createRequestOptions = () => {
    return Object.assign({}, {
        user: {
        },
        url: 'https://domain.local/api'
    })
}

describe("http-harness", function () {
    it("creates request", function (done) {
        const ro = createRequestOptions()
        const user_id = idgen.generate('0')
        ro.user._id = user_id
        const request = httpHarness.createRequest(ro)
        const expected = {
            user: {
                _id: user_id
            },
            body: {},
            params: {},
            url: 'https://domain.local/api'
        }
        expect(request).to.eql(expected)
        done()
    })
    
    it("creates request without url", function (done) {
        try {
            const request = httpHarness.createRequest()
        }
        catch (ex) {
            done()
        }
    })
})