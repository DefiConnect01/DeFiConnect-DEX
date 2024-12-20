import { useQuery } from '@tanstack/react-query';

export const UseGetLeaderBoard = () => {

  const { data, error, isError, isFetching, isLoading, refetch, isFetchedAfterMount } = useQuery({
    queryKey: ['leaderBoard',],
    queryFn: () =>
      fetch('https://intermediate-violette-aremson-660931f7.koyeb.app/api/tx', {
        headers: {
          'cyber-api-key': 'a81f1659-19f1-4552-bb6d-b639852f8914'
        }
      })
        .then((res) => res.json()),
    staleTime: 1000 * 60 * 5,

  });


  // console.log(data)


  return {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
    isFetchedAfterMount
  };
};