"use strict";
const auth = async (req, res, next) => {

    try {

        let authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).send({
                msg: 'unauthorized'
            });
        }
        let headers = authorization.split(';');
        console.log(headers);
        if (headers.length != 2 || !headers[0].startsWith('requester=') || !headers[1].startsWith('rbei_access_token=')) return res.status(401).send({
            msg: 'unauthorized'
        });
        let requester = headers[0].replace('requester=', '');
        let rbei_access_token = headers[1].replace('rbei_access_token=', '');

        //verify the token.
        let query = `SELECT
                    EMAIL_ID,
                    STATUS,
                    TYPE,
                    CASE
                        WHEN GEN_RBEI_TOKEN = ? THEN
                            CASE 
                                WHEN SECONDS_BETWEEN(GEN_RBEI_TOKEN_TMSTMP, NOW())  <= 43200 THEN 1
                                ELSE 0
                            END
                        ELSE -1
                    END AS FLAG
                    FROM RBEI_TOOL_REUSE_REP_T_MD_USER 
                    WHERE EMAIL_ID = ?`;
                    
        const client = req.db;
        const result = await client.exec(query, [rbei_access_token, requester]);
        if (result.length === 0) return res.status(401).send({
            msg: 'unauthorized'
        });

        if (result[0].FLAG != 1) return res.status(401).send({
            msg: 'unauthorized'
        });
        const { EMAIL_ID, STATUS, TYPE } = result[0];


        if (STATUS != 'A') return res.status(403).send({
            msg: 'You are not approved'
        });

        req.email = EMAIL_ID;
        req.rbei_access_role = TYPE;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            error
        });
    }
}

module.exports = auth;