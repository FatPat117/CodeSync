'use client'
import { streamTokenProvider } from '@/actions/stream.action';
import { useUser } from '@clerk/nextjs';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import LoaderUI from '../LoaderUI';

const StreamVideoProvider = ({children}: {children: React.ReactNode}) => {
      
  const [streamVideoClient,setStreamVideoClient] = useState<StreamVideoClient | null>(null);
  const {user,isLoaded} = useUser();

  useEffect(() => {
    if(!isLoaded || !user) return;
    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user:{
        id: user?.id,
        name:user?.firstName || "" + " " + user?.lastName || "" || user?.id,
        image:user?.imageUrl,
      },
      tokenProvider:streamTokenProvider,
  })

  setStreamVideoClient(client);
},[isLoaded,user]);

if(!streamVideoClient) return <LoaderUI/>
return <StreamVideo client={streamVideoClient}>{children}</StreamVideo> 
}
export default StreamVideoProvider;