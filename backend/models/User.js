const {Schema,models,model}=require('mongoose');


const UserSchema=new Schema({
    name:{
        type:String,
        required:true,
        validate:{
            validator:function (val){
                const usernameRegex=/^[a-zA-Z0-9](?!.*[-._]{2,})(?!.*\s{2,})[a-zA-Z0-9][-._a-zA-Z0-9\s]{0,58}[a-zA-Z0-9]$/;
                return usernameRegex.test(val);
            },
            message:'Invalid username. Follow the specified criteria.',
        }
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:function(val){
                const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return val.length >=8 && emailRegex.test(val);
            },
            message: 'Email must be at least 12 characters long and have a valid format',
        }
    
    },
    otp:{
        type:String,
    }
},{timestamps:true})

const User=models.User || model("User",UserSchema);

module.exports=User;