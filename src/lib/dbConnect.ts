import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    try {
       const DB =  await mongoose.connect(process.env.MongoDBUrl || '', {})

       connection.isConnected = DB.connections[0].readyState

       console.log(" DB Connected successfully");
       
    } catch (error) {
        console.error("Error connecting to DB", error);
        process.exit(1);
    }
}

export default dbConnect;