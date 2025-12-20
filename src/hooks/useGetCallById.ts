import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from "react";

const useGetCallById = (callId:string | string[]) => {
    const [call,setCall] = useState<Call | null>(null);
    const [isCallLoading,setIsCallLoading] = useState(true);
    const client = useStreamVideoClient();

    useEffect(() => {
        if(!client) {
            setIsCallLoading(false);
            return;
        }

        // Normalize callId to string
        const normalizedCallId = Array.isArray(callId) ? callId[0] : callId;
        
        if(!normalizedCallId) {
            setIsCallLoading(false);
            return;
        }

        // Create call object directly - this works for both new and existing calls
        // Stream SDK allows creating call objects with any ID, and it will work
        // whether the call exists in the backend or not
        const callInstance = client.call("default", normalizedCallId);
        setCall(callInstance);
        setIsCallLoading(false);
    },[callId,client]);

    return {call,isCallLoading}
}

export default useGetCallById;