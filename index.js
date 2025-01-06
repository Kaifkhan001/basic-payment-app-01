import app from "./app.js";
import connectDB from "./dbConfig/connect.js";

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port:- ${PORT}`);
    });
}).catch((err) => {
    console.log("Error while starting the server!!",err);
});

