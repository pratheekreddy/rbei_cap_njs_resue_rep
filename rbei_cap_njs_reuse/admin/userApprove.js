"use strict";
const express = require('express');
const router = express.Router();
const triggerEmail = require('../email/email.js');
const auth = require('../middleware/auth');

router.post('/approve', auth, async (req, res) => {

    if (req.rbei_access_role != 'A') return res.status(401).send({
        msg: 'unauthorized'
    });
    let email = req.body.email;
    let status = req.body.status;

    let query = "update RBEI_TOOL_REUSE_REP_T_MD_USER set STATUS='" + status + "' where EMAIL_ID='" + email + "'";
    console.log(query)
    try {
        let client = req.db
        let result = await client.exec(query)

        let content = {}
        content.to = email
        if (status === 'A') {
            content.subject = 'Approved'
            content.html = `<p>Your Account has been approved.<p><br>
        <p>Please Login<p>`
        } else {
            content.subject = 'Approved'
            content.html = `<p>Your Rejected has been approved.<p><br>
        <p>Please Contact Administator<p>`
        }

        let temail = await triggerEmail(content)
        res.send({ msg: 'user approved' })
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = router;