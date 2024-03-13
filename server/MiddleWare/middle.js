import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = decodeToken(token);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

function decodeToken(token) {
    const secretKey = 'project_yehudit&sarit';
    const decoded = jwt.verify(token, secretKey);
    const { _id, email, password, name } = decoded;
    return { _id, email, password, name };
}

export default verifyToken;