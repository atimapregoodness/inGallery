 if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");

const CommMsg = require("../models/commMsg");

  const seedCommMsg = async()=>{
    try{
          await mongoose.connect(process.env.MONGO_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
      const msg = new CommMsg({
        title: "inGallery new Domain",
        body: "We a excited to announce that inGallery just got a new domain. ingalery.xyz"
      })
      console.log(msg)

      console.log(await CommMsg.find())

      await msg.save()

    } catch(err){
      console.log(err)
    }finally {
    mongoose.disconnect();
  }
  }
 
  seedCommMsg()