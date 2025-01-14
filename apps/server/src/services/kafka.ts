import { Kafka, Producer } from "kafkajs";
import db from "./prisma";

const kafka = new Kafka({
    clientId: 'motion-chat-producer-app', // Use a descriptive name for your app
    brokers: ['localhost:9092'], // List of broker addresses
  });
  

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}


export async function startMessageConsumer(){
    const consumer = kafka.consumer({groupId:"default"});
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES" ,fromBeginning: true});
    await consumer.run({
        autoCommit: true,
        eachMessage:async ({ message ,pause})=>{
            console.log("message checing point",message.value)
            if(!message.value) return;
          
            try{
                const data = JSON.parse(message.value.toString());
                console.log("message checing point2", data)
                const { email, message: content, timestamp } = data;

                if (!email || !content || !timestamp) {
                  console.error("Invalid message structure:", data);
                  return;
                }

                const user = await db.user.upsert({
                    where: { email },
                    update: {},
                    create: {
                      email,
                      username: email.split("@")[0], // Example: Generate a username from the email
                    },
                  });
          
                  // Create the message
                  await db.message.create({
                    data: {
                      senderId: user.id, // Link message to the user
                      content, // Store the message content
                      createdAt: new Date(timestamp), // Use the provided timestamp
                    },
                  });

            }catch(err){
                console.log("something went wrong")
                pause();
                setTimeout(()=>{
                    consumer.resume([{topic:"MESSAGES"}]);
                },60*1000)
            }
           
        }
    });
}
export default kafka;
