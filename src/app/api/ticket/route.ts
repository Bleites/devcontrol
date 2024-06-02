import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {authOptions} from '@/lib/auth'
import prismaClient from '@/lib/prisma'




// http://localhost:3000/api/ticket do tipo patch
export async function PATCH(request: Request){

    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return NextResponse.json({error: "Not authorized."}, { status: 401 })
    }

    // Aqui vamos buscar o id que veio na requisição json
    const {id} = await request.json()

    // e agora vamos procurar o ticket com o id passado
    const findTicket = await prismaClient.ticket.findFirst({
        where:{
            id: id as string
        }
    })

    if(!findTicket){
        return NextResponse.json({error: "Failed to update ticket."}, {status: 400})
    }

    try {
        await prismaClient.ticket.update({
            where:{
                id: id as string
            },
            data:{
                status: "CLOSED"
            }
            
        })
        return NextResponse.json({error: "Ticket updated sucessfully."})
    } catch (error) {
        return NextResponse.json({error: "Failed to update ticket."}, {status: 400})
    }
}

export async function POST(request: Request){
    const { customerId, name, description } = await request.json();
  
    if(!customerId || !name || !description){
      return NextResponse.json({ error: "Failing while create a new ticket!"}, { status: 400 });
    }
  
    try{
  
      await prismaClient.ticket.create({
        data:{
          name: name,
          description: description,
          status: "OPEN",
          customerId: customerId,
        }
      })
  
      return NextResponse.json({ message: "Ticket registered with sucess!"})
  
    }catch(err){
      return NextResponse.json({ error: "Failing while create a new ticket!"}, { status: 400 });
    }
  
  }