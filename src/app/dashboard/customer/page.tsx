import { Container } from '@/components/container';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { CardCustomer } from './components/card';
import prismaClient from '@/lib/prisma';

export default async function Customer() {
	// espera pelos dados do servidor da session, se existe ou não sessão
	const session = await getServerSession(authOptions);

	// se não existe sessão iniciada, ou não existe dados de utilizador nesta sessão
	// é redirecionado para a home.
	if (!session || !session.user) {
		redirect('/');
	}

	// aqui vamos aceder ao nosso ORM prisma, onde tem a nossa data base e vamos buscar todos os customer
	const customers = await prismaClient.customer.findMany({
		//mas só vamos buscar os customers que pertencem ao id do user que está logado.
		where: {
			userId: session.user.id,
		},
	});

	return (
		<Container>
			<main className="mt-9 mb-2">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">My Clients</h1>
					<Link
						href="/dashboard/customer/new"
						className="bg-blue-500 text-white px-4 py-1 rounded"
					>
						New Client
					</Link>
				</div>

				<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
					{customers.map((customer) => (
						<CardCustomer key={customer.id} customer={customer} />
					))}
				</section>

				{customers.length === 0 && (
					<h1 className="text-gray-600">No clients registered here.</h1>
				)}
			</main>
		</Container>
	);
}
