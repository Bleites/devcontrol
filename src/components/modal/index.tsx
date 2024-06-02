'use client';
// importar useContext para poder importar o ModelContext criado para usar as props que foram exportadas
import { useContext, useRef, MouseEvent } from 'react';
import { ModalContext } from '@/providers/modal';

export function ModalTicket() {
	const { handleModalVisible, ticket } = useContext(ModalContext);

	// vamos atrelar a nossa ref á div do modal que é da tipagem HTMLDivElement (para facilitar usar sempre divs)
	const modalRef = useRef<HTMLDivElement | null>(null);

	// é tipada como um mouseElement no elemento div
	const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
		// verificamos se existe o modalRef no current e se existe se o nosso click não está a ser em cima
		// do modal, se não estiver, fechamos o modal, se estiver a ser não fechamos.
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			handleModalVisible();
		}
	};

	return (
		<div
			className="absolute bg-gray-900/80 w-full min-h-screen"
			onClick={handleModalClick}
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<div
					ref={modalRef}
					className="bg-white shadow-lg w-4/5 md:w-1/2 max-w-2xl p-3 rounded"
				>
					<div className="flex items-center justify-between mb-4">
						<h1 className="font-bold text-lg md:text-2xl">Ticket Details</h1>
						<button
							onClick={handleModalVisible}
							className="bg-red-500 p-1 px-2 text-white rounded"
						>
							Close
						</button>
					</div>

					<div className="flex flex-wrap gap-1 mb-2">
						<h2 className="font-bold">Ticket Name:</h2>
						<p>{ticket?.ticket?.name}</p>
					</div>

					<div className="flex flex-wrap flex-col gap-1 mb-2">
						<h2 className="font-bold">Description:</h2>
						<p>{ticket?.ticket.description}</p>
					</div>

					<div className="w-full border-b-[1.5px] my-4"></div>
					<h1 className="font-bold text-lg mb-4">Customer Details</h1>

					<div className="flex flex-wrap gap-1 mb-2">
						<h2 className="font-bold">Name:</h2>
						<p>{ticket?.customer?.name}</p>
					</div>

					<div className="flex flex-wrap gap-1 mb-2">
						<h2 className="font-bold">Phone:</h2>
						<p>{ticket?.customer?.phone}</p>
					</div>

					<div className="flex flex-wrap gap-1 mb-2">
						<h2 className="font-bold">Email:</h2>
						<p>{ticket?.customer?.email}</p>
					</div>

					{ticket?.customer?.adress && (
						<div className="flex flex-wrap gap-1 mb-2">
							<h2 className="font-bold">Adress:</h2>
							<p>{ticket?.customer?.adress}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
