import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';
const EndCallButton = () => {
  const call = useCall(); 
  const router = useRouter()
  const {useLocalParticipant} = useCallStateHooks();
  const localParticipant = useLocalParticipant();


  const updateInterviewStatus = useMutation(api.interview.updateInterviewStatus);

  // Query will return null if call ID is not available (handled in Convex function)
  // Use empty string as fallback to satisfy TypeScript - Convex function will handle it
  const interview = useQuery(
    api.interview.getInterviewByStreamId,
    call?.id ? { streamCallId: call.id } : { streamCallId: "" }
  );

  if(!call || !interview) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id
  if(isMeetingOwner) return null;


  const handleEndCall = async () => {
    try {
      await call.endCall()
      await updateInterviewStatus({
        interviewId: interview._id,
        status: "completed",
      });
      router.push("/");
      toast.success("Meeting ended successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to end meeting");
      router.push("/");
    }
  
  }

  return (
 <Button variant={'destructive'} onClick={handleEndCall}> End Meeting</Button>
  )
}

export default EndCallButton
