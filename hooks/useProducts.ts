import useSWR, { SWRConfiguration } from "swr";
import { IProduct } from "../interfaces";

const fetcher = (...args: [key: string]) =>
  fetch(...args).then((res) => res.json());

export const useProdducts = (url: string, config: SWRConfiguration = {}) => {
  // const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
  const { data, error } = useSWR<IProduct[] | IProduct>(
    `/api${url}`,
    fetcher,
    config
  );

  return {
    products: data,
    isLoading: !data && !error,
    isError: error,
  };
};
