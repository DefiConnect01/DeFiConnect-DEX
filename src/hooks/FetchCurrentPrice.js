import { useQuery } from '@tanstack/react-query';

const apiKey = '9a9e9c11b71aa4f95d1cc0a0039bdb6d5af359c11c6ced94634337c5fb56e8a2'; 

export const FetchCurrentPrice = (token = 'CYBA') => {
  const options = {
    method: 'GET',
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };

  const { data, error, isError, isFetching, isLoading, refetch, isFetchedAfterMount } = useQuery({
    queryKey: ['apiOfPrice', token],
    queryFn: () =>
      fetch(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${apiKey}`, options)
        .then((res) => res.json()),
  });



  return { 
    data:data?.USD, 
    error, 
    isError, 
    isFetching, 
    isLoading, 
    refetch, 
    isFetchedAfterMount 
  };
};
