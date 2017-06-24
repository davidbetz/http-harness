# HTTP Harness for Node.js API Development

**Copyright (C) 2016-2017 David Betz**

[![Build Status](https://travis-ci.org/davidbetz/http-harness.svg?branch=master)](https://travis-ci.org/davidbetz/http-harness)

## Purpose

Put simply: **to aid in building Node.js HTTP APIs**

Testing HTTP tests too much and creating a fake endpoint doesn't actually help you develop your endpoint. Just build the `req` and `res` and be done with it.

## Usage

### Writing your tests

**`test/samples.js`** (adapted for external use)

You need `httpHarness`. I use `idgen` to generate fake IDs:

	const httpHarness = require('http-harness')
	const idgen = httpHarness.idgen

Review the following test sample, then review following commentary:

	const createRequestOptions = () => {
	    return Object.assign({}, {
	        user: {
	        },
	        url: 'https://domain.local/api/samples'
	    })
	}
    
    it("add new sample", function (done) {
        const user_id = idgen.generate(this.test.title)

        const ro = createRequestOptions()
        ro.user._id = user_id
        ro.body = { value: 12345 }

        const req = httpHarness.createRequest(ro)
        const res = httpHarness.createResponse()

        res.setDone((obj) => {
            expect(obj.code).to.equal(200)
            expect(obj.json_obj.length).to.gt(10)
            done()
        })
        samples.post(req, res, () => { })
    })

Now for the commentary...

For the sake of this test, I'm generating a unique ID as a `user_id` (do whatever you want):

    const user_id = idgen.generate(this.test.title)

This uses the title of the test as the randomization seed.

Then I create an HTTP request object and add stuff to it. In this case, I'm adding `user._id` because that's what my passport-based API uses internally for authentication. `createRequestOptions` simple provides a template; use it to add whatever you want to the request.

    const ro = createRequestOptions()
    ro.user._id = user_id
    ro.body = { value: 12345 }

Then I create the req/res objects. This is the same every time.

    const req = httpHarness.createRequest(ro)
    const res = httpHarness.createResponse()

Then I set my callback (dump the output of obj to screen to see what you're dealing with; output isn't always `json_obj`):

    res.setDone((obj) => {
        expect(obj.code).to.equal(200)
        expect(obj.json_obj.length).to.gt(10)
        done()
    })

Finally, I call the API:

    samples.post(req, res, () => { })

### Making your APIs testable

In the previous usage section, `samples.post` is called. That needs to exist and be callable.

To make this happen, you simply **decouple your export from `express`**:

**`endpoints/samples.js`** (partial snippet)
	
	module.exports.post = function (req, res, next) {
	    debug("POST /api/samples")
	    if (typeof req.user === 'undefined' || typeof req.user._id === 'undefined') {
	        return response.send401(res)
	    }
	    const user_id = req.user._id
	    const session_id = idgen.generate('sample::post')
	    const item = Object.assign({}, req.body)
	    memorydb.insert(user_id, session_id, item)
	        .then(p => response.sendJson(res, 200, p))
	        .catch(err => response.routeError(res, err))
	}
	
	module.exports.init = function (app) {
	    app.post("/api/samples", auth0.authCheck, module.exports.postSample)
	}

This follows the pattern of calling `init` from your `index` to initialize your endpoint. You don't have to do that; it simply allows you to keep express decoupled from the API logic itself.

# Tips

Copy by-value when sending stuff to your test. JavaScript's by-ref default often causes unexpected results. For example, if you're modifying your body input in your API, this would be modified in your tests too. That's just how by-ref works. The following is a by-value copy in JavaScript:

 	const item = Object.assign({}, req.body)

This creates a new object ({}), copies `req.body` to it, then returns.

The same goes for arrays. If you don't want to pass around a reference to your array, create a copy:

	const myNewArray = myArray.slice(0)
