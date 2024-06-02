'use client';
import { useRouter } from 'next/navigation';
import { FiRefreshCcw } from 'react-icons/fi';

export function ButtonRefresh() {
	const router = useRouter();

	return (
		<button
			className="bg-gray-900 px-4 p-1  rounded"
			onClick={() => router.refresh()}
		>
			<FiRefreshCcw size={24} color="#FFF" />
		</button>
	);
}
