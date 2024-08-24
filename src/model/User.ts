import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String, 
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username: string;
    messages: Message[];
    email:string;
    password:string;
    verifyCode:string;
    isVerified: boolean;
    verifyCodeExpiry:Date;
    isAcceptingMessages:boolean;
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "UserName is required"],
        unique: true
    },
    messages: [MessageSchema],
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Enter valid Email"]
    },
    password:{
        type: String,
        required: [true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required: [true,"Verifie code is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCodeExpiry:{
        type:Date,
        required: [true,"VerifieCodeExpiry is required"]
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    }
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default  UserModel;