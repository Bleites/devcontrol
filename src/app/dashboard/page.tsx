// tem que ser export default por se tratar de uma página
import { Container } from '@/components/container/index';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TicketItem } from './components/ticket';

import prismaClient from '@/lib/prisma';
import { ButtonRefresh } from '@/app/dashboard/button';

// como vamos esperar resultados vindos do servidor esta fn tem de ser async
export default async function Dashboard() {
	// espera pelos dados do servidor da session, se existe ou não sessão
	const session = await getServerSession(authOptions);

	// se não existe sessão iniciada, ou não existe dados de utilizador nesta sessão
	// é redirecionado para a home.
	if (!session || !session.user) {
		redirect('/');
	}

	const tickets = await prismaClient.ticket.findMany({
		where: {
			status: 'OPEN',
			customer: {
				userId: session.user.id,
			},
		},
		include: {
			customer: true,
		},
		// vamos ordenar por data mas também podemos ordenar por costumer etc, seria ótimo criar por close e open
		orderBy: {
			created_at: 'asc',
		},
	});
	console.log(tickets);

	return (
		<Container>
			<main className="mt-9 mb-2">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Tickets</h1>
					<div className="flex items-center gap-3">
						<ButtonRefresh />
						<Link
							href="/dashboard/new"
							className="bg-blue-500 px-4 py-1 rounded text-white"
						>
							Open Ticket
						</Link>
					</div>
				</div>

				<table className="min-w-full my-8">
					<thead>
						<tr>
							<th className="font-medium text-left pl-1">CUSTOMER</th>
							<th className="font-medium text-left hidden sm:table-cell">
								TICKET DATE
							</th>
							<th className="font-medium text-left">STATUS</th>
							<th className="font-medium text-left"># ACTION</th>
						</tr>
					</thead>

					{tickets.length !== 0 && (
						<tbody>
							{tickets.map((t) => (
								<TicketItem key={t.id} customer={t.customer} ticket={t} />
							))}
						</tbody>
					)}
				</table>

				{tickets.length === 0 && (
					<h1 className="px-2 md:px-0 text-gray-600">
						No tickets registered here.
					</h1>
				)}
			</main>
		</Container>
	);
}
