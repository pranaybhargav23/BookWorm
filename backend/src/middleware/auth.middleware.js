import jwt from "jsonwebtoken";
import User from "../models/User.js";

//from the frontend 

// const response = await fetch(`http://localhost:3000/api/books`.{
//     method:"POST",
//     body:JSON.stringify({
//         title,
//         caption
//     }),
//     headers:{Authorization:`Bearer ${token}`},
// });

const protectRoute = async (req,res,next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Not authorized, no token" });

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       //find user by id
       const user = await User.findById(decoded.userId).select("-password");

       if (!user) return res.status(401).json({ message: "Not authorized, user not found" });

       req.user = user;
       next();

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}

export default protectRoute;