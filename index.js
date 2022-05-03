import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { MongoClient } from "mongodb";
import joi from 'joi'
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

//mongoClient.connect().then(() => {
//	db = mongoClient.db("meu_lindo_projeto");
//});

const app = express();
app.use(express.json());
app.use(cors());


let caixa =[]
app.post('/participants',async (req, res) => {
    const nome = req.body;
    const userSchema = joi.object({
        name: joi.string().required(),
      });
    const validar = userSchema.validate(nome)
    if(validar.error){
        res.status(422).send('nome não tá legal  -_-')
        return;
    }
    try{
        await mongoClient.connect()
        db = mongoClient.db("meu_lindo_projeto");
        try{
        const nomee = await db.collection("participants").findOne({name:nome.name})
        console.log(nomee.name)
        if(nomee.name ===nome.name){
            res.sendStatus(409)
            console.log('ja tem esse nome')
            mongoClient.close();
       }}  catch(e){
        await db.collection("participants").insertOne({
            name: nome.name,
            lastStatus:  Date.now()
        });
        res.send('ok');
       
        mongoClient.close();
       }
      n 
    }  catch(e){
        console.log('deu ruim no nome')
        res.status(500)
        mongoClient.close();
    }
   // if (nome.nome !== '') { // validação
       // let comparar = nomes.find(function(comparar){
            
          //  return comparar === nome.name
      //  })
        
      //  if(comparar===nome.name){
          //  console.log(   'entrou if')
          //  res.sendStatus(409);
      //  }else{
           // db.collection("participants").insertOne({
              //  name: nome.name,
            //    lastStatus:  Date.now()
         //   });
          //  console.log(   'entrou else')
          
            
            
           // res.send('ok');
       // }
        
      
    //  } else {
     //   res.sendStatus(422);
    //  }
  
});
app.get("/participants",async (req,res) =>{
    try{
        await mongoClient.connect()
      
        db = mongoClient.db("meu_lindo_projeto");
     
        const participants = await db.collection("participants").find().toArray()  
	    res.send(participants);
        mongoClient.close();
    } catch(e){
        console.log('deu ruim3')
        res.status(500)
        mongoClient.close();
    }
    
});
app.post('/messages',async (req, res) => {
    const mensagem = req.body;
    const porFavorFunciona = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().required()
      });
      const validar = porFavorFunciona.validate(mensagem)
      if(validar.error){
        res.status(422).send('messages não tá legal  -_-')
        return;
    }
    try{
        await mongoClient.connect()
        db = mongoClient.db("meu_lindo_projeto");

        await db.collection("messages").insertOne({
        
            to: mensagem.to,
            text: mensagem.text,
            type: mensagem.type
            
        });
        mongoClient.close();
        res.status(201)
    } catch(e){
        console.log('deu ruim2')
        res.status(500)
        mongoClient.close();
    }
   
});
app.get("/messages",async (req,res) =>{
    
    const limit = parseInt(req.query.limit);
   try {
    await mongoClient.connect()
    db = mongoClient.db("meu_lindo_projeto");
    
    if(limit==''){
    console.log('if gostoso')
    const msg = await db.collection("messages").find().toArray()
   
    res.send(msg);
    mongoClient.close();
    }else{
        const msgg = await db.collection("messages").find().toArray()
        let i =msgg.length-limit;
        let cont =0
       
        while(cont !=limit){ 
            if(msgg[i]== undefined){
                 
              i=i+1
                 cont=cont+1
            }else{
                
                  caixa.push(msgg[i])
                 
                i=i+1
                 cont=cont+1
             }
          }
          res.send(caixa);
          caixa=[]
          mongoClient.close();

    }
   } catch(e){
    console.log('deu ruim1??')
    res.status(500)
    mongoClient.close();
   }
    //if(limit == undefined){
      //  console.log('oi')
       // db.collection("messages").find().toArray().then(message => {
         //   res.send(message);
      //  })
        
  //  }else{
      //  db.collection("messages").find().toArray().then(message => {
         
       // let i = limit-1;
      //  let cont =0
      //  while(cont !=limit){ 
          //  if(message[i]== undefined){
               
            //    i=i-1
           //     cont=cont+1
          //  }else{
              //  caixa.push(message[i])
               
          //      i=i-1
       //         cont=cont+1
       //     }
     //   }
      //  res.send(caixa);
     //   caixa=[]
  //  })
  //  }
   
});
/*
app.post('/status', async (req, res) => {
   const user =req.headers.user
   try{
    await mongoClient.connect()
    db = mongoClient.db("meu_lindo_projeto");
  
    await db.collection("participants").updateOne({name:user},{$set:{lastStatus: Date.now()}})
    mongoClient.close();
   }catch(e){
    console.log('deu ruim1 status')
    res.status(500)
    mongoClient.close();
   }
   
    
    
    //db.collection("participants").find().toArray().then(participant => {
      //  for(let i=0;i<participant.length;i++){
        //    if(participant[i].name==user){
          //      participant[i].updateOne({name:user},{set$:{lastStatus:Date.now()}})
            //}
        //}
  
//	})
                
    
        
  //          res.sendStatus(409);
    
});
*/
function apagar(participants,tempo){
    let b =participants.length
    const a = Date.now()
    
   
    console.log('aaa')
    console.log(tempo)
    if(tempo!== undefined){
        db.collection("participants").deleteMany({lastStatus:  tempo.lastStatus })
    }
}

app.listen(5000,() =>{
    console.log(chalk.bold.green('funcionando!'))
})