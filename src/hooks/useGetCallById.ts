import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from "react";

const useGetCallById = (callId:string | string[]) => {
    const [call,setCall] = useState<Call | null>(null);
    const [isCallLoading,setIsCallLoading] = useState(true);
    const client = useStreamVideoClient();

    useEffect(() => {
        if(!client) return;
        const getCall = async () =>{
          try {
            const {calls} = await client.queryCalls({
              filter_conditions:{callId}
            }) 

            if(calls.length > 0) setCall(calls[0]);
          } catch (error) {
            console.log(error);
            setCall(null);
          } finally{
            setIsCallLoading(false);
          }
        }
        getCall();
    },[callId,client]);

    return {call,isCallLoading}
}

export default useGetCallById;