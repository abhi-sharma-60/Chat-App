import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import getUserDetailsFromToken from '../helpers/getUserDetailsFromToken.js'
import { UserModel } from '../models/usermodel.js'
import { ConversationModel, MessageModel } from '../models/chatmodel.js'
import getConversation from '../helpers/getConversation.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config({ path: './.env' })


const app = express()

/***socket connection */
const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})

/***
 * socket running at http://localhost:3000/
 */

//online user
const onlineUser = new Set()

io.on('connection',async(socket)=>{
    console.log("connect User ", socket.id)

    const token = socket.handshake.auth.token 

    //current user details 
    const user = await getUserDetailsFromToken(token)

    //check if authorized user
    if(user?.logout){
        socket.emit('unauthorized', { message: "User not logged in or token invalid" });
        return socket.disconnect(); 
    }

    //create a room
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page', async (userId) => {
        try {
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return socket.emit('error', { message: "Invalid user ID" });
            }
    
            const userDetails = await UserModel.findById(userId).select("-password");
    
            if (!userDetails) {
                return socket.emit('error', { message: "User not found" });
            }
    
            const payload = {
                _id: userDetails._id,
                name: userDetails.name,
                email: userDetails.email,
                profile_pic: userDetails.profile_pic,
                online: onlineUser.has(userId)
            };
    
            socket.emit('message-user', payload);
    
            // Get previous message
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user._id, receiver: userId },
                    { sender: userId, receiver: user._id }
                ]
            }).populate('messages').sort({ updatedAt: -1 });
    
            socket.emit('message', getConversationMessage?.messages || []);
        } catch (error) {
            console.error("Error in 'message-page':", error.message);
            socket.emit('error', { message: "Server error" });
        }
    });


    //new message
    socket.on('new message',async(data)=>{

        //check conversation is available both user
        try {
            
        let conversation = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        })

        //if conversation is not available
        if(!conversation){
            const createConversation = await ConversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await createConversation.save()
        }
        
        const message = new MessageModel({
          text : data.text,
          imageUrl : data.imageUrl,
          videoUrl : data.videoUrl,
          msgByUserId :  data?.msgByUserId,
          msgToUserId: data?.msgToUserId
        })
        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne({ _id : conversation?._id },{
            "$push" : { messages : saveMessage?._id }
        })

        const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        }).populate('messages').sort({ updatedAt : -1 })


        io.to(data?.sender).emit(`message:${data?.receiver}`, getConversationMessage?.messages || []);
        io.to(data?.receiver).emit(`message:${data?.sender}`, getConversationMessage?.messages || []);

        //console.log(getConversationMessage.messages)
        //console.log("----------------------------------------------------")
        //send conversation
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)

        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.receiver).emit('conversation',conversationReceiver)
        //console.log(conversationSender)
        } catch (error) {
            console.error('Error in new message handler:', error);
    socket.emit('error', { message: 'Server error occurred while sending message' });
  
        }
    })


    //sidebar
    socket.on('sidebar',async(currentUserId)=>{
        try {
            console.log("current user",currentUserId)

        const conversation = await getConversation(currentUserId)

        socket.emit('conversation',conversation)
        } catch (error) {
            console.error('Error in new sidebar handler:', error);
    socket.emit('error', { message: 'Server error occurred while sending message' });
  
        }
        
    })

    socket.on('seen',async(msgByUserId)=>{
        try {
            
        let conversation = await ConversationModel.findOne({
            "$or" : [
                { sender : user?._id, receiver : msgByUserId },
                { sender : msgByUserId, receiver :  user?._id}
            ]
        })

        const conversationMessageId = conversation?.messages || []

        const updateMessages  = await MessageModel.updateMany(
            { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
            { "$set" : { seen : true }}
        )

        //send conversation
        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)
        } catch (error) {
            console.error('Error in new seen handler:', error);
    socket.emit('error', { message: 'Server error occurred while sending message' });
  
        }
    })

    //disconnect
    socket.on('disconnect',()=>{
        try {
            onlineUser.delete(user?._id?.toString())
        console.log('disconnect user ',socket.id)
        } catch (error) {
            console.error('Error in new seen handler:', error);
    socket.emit('error', { message: 'Server error occurred while sending message' });
  
        }
    })
})

export {app,server}
