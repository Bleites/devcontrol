
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismaClient from '@/lib/prisma'

// rota para pesquisar um cliente
export async function GET(request: Request){
  // vamos usar o searchParams para ir buscar o parametro que vamos enviar pela URL que vai ser o email
  const { searchParams } = new URL(request.url)
  const customerEmail = searchParams.get("email")
  console.log("email recebido", customerEmail)
  
  if(!customerEmail || customerEmail === ""){
    return NextResponse.json({error: "Customer not found."}, {status: 400}) 
  }

  try {
    const customer = await prismaClient.customer.findFirst({
      where:{
        email: customerEmail,
      }
    })

    return NextResponse.json(customer)
    
  } catch (error) {
    return NextResponse.json({error: "Customer not found."}, {status: 400})
  }

}

// rota para eliminar um cliente
export async function DELETE(request: Request){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  // vamos usar o search params para ir buscar o parametro que queremos á rota, que é o id
  const { searchParams } = new URL(request.url);
  // aqui vamos armazenar o id
  const userId = searchParams.get("id")
  console.log("id do cliente: ", userId)

  // caso não seja passado um userId então não vamos eliminar
  if(!userId){
    return NextResponse.json({ error: "Fail to delete the customer, user id not found." }, { status: 400 })
  }

  // se tivermos algum ticket aberto associado a este cliente, não o podemos eliminar
  const findTickets = await prismaClient.ticket.findFirst({
    where:{
      customerId: userId,
      status: "OPEN"
    }
  })

  if(findTickets){
    return NextResponse.json({ error: "Fail to delete the costumer, tickets are open." }, { status: 400 })
  }

  // aqui vamos acessar o nosso prismaClient, aceder a parte de customer e activar a function delete
  // where -> pelo id que é igual ao userId passado
  try {
    await prismaClient.customer.delete({
      where:{
        id: userId as string
      }
    })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Fail to delete the customer." }, { status: 400 })
  }

  return NextResponse.json({ok: true})
}

// rota para cadastrar um cliente
export async function POST(request: Request){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const { name, email, phone, adress, userId } = await request.json();

  try{
    await prismaClient.customer.create({
      data:{
        name,
        phone,
        email,
        adress: adress ? adress : "",
        userId: userId
      }
    })

    return NextResponse.json({ message: "New Cliente registered!" })

  }catch(err){
    return NextResponse.json({ error: "Failed white create a new customer!" }, { status: 400 })
  }

}