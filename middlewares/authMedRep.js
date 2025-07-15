import jwt from "jsonwebtoken";

const authMedRep = async (req, res, next) => {
    try {
        const { mtoken } = req.headers;
        
        if (!mtoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decode = jwt.verify(mtoken, process.env.JWT_SECRET);
        req.body.medRepId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authMedRep;