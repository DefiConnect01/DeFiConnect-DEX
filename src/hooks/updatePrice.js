// import { useQuery } from '@tanstack/react-query';

// export const updatePrice = (networkId) => {
//     const { data, error, isError, isFetching, isLoading, refetch, isFetchedAfterMount } = useQuery({
//         queryKey: ['price', networkId], // Include networkId in queryKey to refresh when it changes
//         queryFn: () =>
//             fetch('/api/price', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'cyber-api-key': 'a81f1659-19f1-4552-bb6d-b639852f8914'
//                 },
//                 body: JSON.stringify({ network: networkId })
//             })
//                 .then((res) => {
//                     if (!res.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     return res.json();
//                 }),
//         staleTime: 1000 * 60 * 5, // Cache for 5 minutes
//         enabled: !!networkId, // Only run query if networkId is provided
//     });

//     return {
//         data,
//         error,
//         isError,
//         isFetching,
//         isLoading,
//         refetch,
//         isFetchedAfterMount
//     };
// };

// // Usage example:
// // const { data, isLoading } = useGetPrice("ethereum");