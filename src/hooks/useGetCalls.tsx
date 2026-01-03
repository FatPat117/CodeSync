import { useUser } from "@clerk/nextjs";

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
const useGetCalls = () =>{
  const {user} = useUser()
  const client  = useStreamVideoClient();
  const [calls, setCalls] = useState <Call[]>();
  const [isLoading,setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadCalls = async() =>{
      if(!client || !user) return;
      try {
        setIsLoading(true);
        const {calls} = await client.queryCalls({
          sort:[{field:'starts_at',direction:-1}],
          filter_conditions:{
            starts_at:{$exists:true},
            $or:[{
              created_by_user_id:user.id,
            },{
              members:{$in:[user.id]}
            }]
          }
        })
        setCalls(calls as Call[]);
      } catch (error) {
        console.error('Error loading calls:', error);
        setCalls([]);
      }finally{
        setIsLoading(false)
      }
    }
    loadCalls();
  },[client,user]);

  const now = new Date();
  const endedCalls = calls?.filter(({state:{startsAt,endedAt}}) => (startsAt && new Date(startsAt) < now ) || !!endedAt) ;
  const upcomingCalls = calls?.filter(({state:{startsAt,endedAt}}) => (startsAt && new Date(startsAt) > now )) ;
  const liveCalls = calls?.filter(({state:{startsAt,endedAt}}) => (startsAt && new Date(startsAt) < now && !endedAt )) ;
  return {calls, isLoading, endedCalls,upcomingCalls,liveCalls};

}

export default useGetCalls;