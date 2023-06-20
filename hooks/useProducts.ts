
import useSWR, { SWRConfiguration } from "swr"
import { ICourse, IEvent, IJob } from "@/interfaces";


export const useProducts = ( url: string, config: SWRConfiguration = {} ) => {
    
//  const { data, error } = useSWR<IProduct[]>(`/api/${ url }`, fetcher, config );
  const { data, error } = useSWR<IJob[] | IEvent[] | ICourse[]>(`/api/${ url }`, config );

  return {
    products: data || [], 
    isLoading: !error && !data,
    isError: error
  }

}