'use client'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk';
import { CameraIcon, MicIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
const MeetingSetup = ({onSetupComplete}:{onSetupComplete:() => void}) => {

  const [isCameraDisabled,setIsCameraDisabled] = useState(true);
  const [isMicDisabled,setIsMicDisabled] = useState(false);

  const call = useCall();

  useEffect(() =>{
    if(!call) return;
    
    const handleCameraToggle = async () => {
      if(isCameraDisabled) {
        try {
          call.camera.disable();
        } catch (error) {
          console.error('Error disabling camera:', error);
        }
      } else {
        try {
          // First, request permission by trying to get user media
          // This ensures permission is granted before Stream SDK tries to access it
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Stop the stream immediately - we just needed to request permission
            stream.getTracks().forEach(track => track.stop());
          } catch (permError: unknown) {
            const permErrorMessage = permError instanceof Error ? permError.message : String(permError);
            const permErrorName = permError instanceof Error ? permError.name : '';
            
            if (permErrorName === 'NotAllowedError' || permErrorMessage.includes('permission') || permErrorMessage.includes('Permission')) {
              toast.error('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
              setIsCameraDisabled(true);
              return;
            }
            // If it's not a permission error, continue to try enabling camera
          }

          // Check if camera is available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          
          if (!hasCamera) {
            toast.error('No camera found. Please connect a camera device.');
            setIsCameraDisabled(true);
            return;
          }

          // Now enable camera through Stream SDK
          await call.camera.enable();
        } catch (error: unknown) {
          console.error('Error enabling camera:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorName = error instanceof Error ? error.name : '';
          
          // More specific error messages
          if (errorMessage.includes('Permission') || errorMessage.includes('permission') || errorMessage.includes('not granted') || errorName === 'NotAllowedError') {
            toast.error('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
          } else if (errorMessage.includes('NotFoundError') || errorName === 'NotFoundError' || errorMessage.includes('not found')) {
            toast.error('No camera device found. Please connect a camera.');
          } else if (errorMessage.includes('NotReadableError') || errorName === 'NotReadableError' || errorMessage.includes('Could not start video source') || errorMessage.includes('video source') || errorMessage.includes('in use')) {
            toast.error('Camera is being used by another application or is locked. Please:\n1. Close other apps using the camera (Zoom, Teams, Skype, etc.)\n2. Restart your browser\n3. Check if camera is locked by system settings');
          } else if (errorMessage.includes('OverconstrainedError') || errorName === 'OverconstrainedError' || errorMessage.includes('constraint')) {
            toast.error('Camera settings are not supported. Please try different settings.');
          } else {
            toast.error(`Failed to enable camera: ${errorMessage || 'Unknown error'}. Please check your browser settings and ensure no other apps are using the camera.`);
          }
          setIsCameraDisabled(true); // Revert the toggle on error
        }
      }
    };

    handleCameraToggle();
  },[isCameraDisabled,call])

  useEffect(() =>{
    if(!call) return;
    
    const handleMicToggle = async () => {
      if(isMicDisabled) {
        try {
          call.microphone.disable();
        } catch (error) {
          console.error('Error disabling microphone:', error);
        }
      } else {
        try {
          // First, request permission by trying to get user media
          // This ensures permission is granted before Stream SDK tries to access it
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately - we just needed to request permission
            stream.getTracks().forEach(track => track.stop());
          } catch (permError: unknown) {
            const permErrorMessage = permError instanceof Error ? permError.message : String(permError);
            const permErrorName = permError instanceof Error ? permError.name : '';
            
            if (permErrorName === 'NotAllowedError' || permErrorMessage.includes('permission') || permErrorMessage.includes('Permission')) {
              toast.error('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
              setIsMicDisabled(true);
              return;
            }
            // If it's not a permission error, continue to try enabling microphone
          }

          // Check if microphone is available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasMic = devices.some(device => device.kind === 'audioinput');
          
          if (!hasMic) {
            toast.error('No microphone found. Please connect a microphone device.');
            setIsMicDisabled(true);
            return;
          }

          // Now enable microphone through Stream SDK
          await call.microphone.enable();
        } catch (error: unknown) {
          console.error('Error enabling microphone:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorName = error instanceof Error ? error.name : '';
          
          // More specific error messages
          if (errorMessage.includes('Permission') || errorMessage.includes('permission') || errorMessage.includes('not granted') || errorName === 'NotAllowedError') {
            toast.error('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
          } else if (errorMessage.includes('NotFoundError') || errorName === 'NotFoundError' || errorMessage.includes('not found')) {
            toast.error('No microphone device found. Please connect a microphone.');
          } else if (errorMessage.includes('NotReadableError') || errorName === 'NotReadableError' || errorMessage.includes('Could not start audio source') || errorMessage.includes('audio source') || errorMessage.includes('in use')) {
            toast.error('Microphone is being used by another application or is locked. Please:\n1. Close other apps using the microphone\n2. Restart your browser\n3. Check if microphone is locked by system settings');
          } else if (errorMessage.includes('OverconstrainedError') || errorName === 'OverconstrainedError' || errorMessage.includes('constraint')) {
            toast.error('Microphone settings are not supported. Please try different settings.');
          } else {
            toast.error(`Failed to enable microphone: ${errorMessage || 'Unknown error'}. Please check your browser settings and ensure no other apps are using the microphone.`);
          }
          setIsMicDisabled(true); // Revert the toggle on error
        }
      }
    };

    handleMicToggle();
  },[isMicDisabled,call])


  const handleJoin = async() =>{
    if(!call) return;
    await call.join();
    onSetupComplete();
  }

  if(!call) return null;
  return (
   <div className='min-h-screen flex items-center justify-center p-6 bg-background/95'>
    <div className='w-full max-w-[1200px] mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Video Preview container */}
        <Card className='md:col-span-1 p-6 flex flex-col'>
          <div>
            <h1 className='text-xl font-semibold mb-1'>Camera Preview</h1>
            <p className='text-sm text-muted-foreground'>Your video will appear here</p>
          </div>

          {/* Video Preview */}
          <div className='mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative'>
            <div className='absolute inset-9'>
              <VideoPreview className='h-full w-full'/>
            </div>
          </div>
        </Card>


        {/* Card controls */}
        <Card className='md:cols-span-1 p-6'>
          <div className='h-full flex flex-col'>
            {/* Meetings Details */}
              <div>
                <h2 className='text-xl font-semibold mb-1'>Meeting Details</h2>
                <p className='text-sm text-muted-foreground break-all'>{call.id}</p>
              </div>

              <div className='flex-1 flex flex-col justify-between'>
                <div className='space-y-6 mt-8'>
                  {/* Cam control*/}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                        <CameraIcon className='h-5 w-5 text-primary'/>
                      </div>
                      <div>
                      <p className='font-medium'>Camera</p>
                      <p className='text-sm text-muted-foreground'>
                        {isCameraDisabled?'Off':"On"}
                      </p>
                    </div>
                    </div>
                  <Switch checked={!isCameraDisabled} onCheckedChange={(checked) => setIsCameraDisabled(!checked)}/>
                  </div>


                  {/* Mic control*/}
                   <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                        <MicIcon className='h-5 w-5 text-primary'/>
                      </div>
                      <div>
                      <p className='font-medium'>Microphone</p>
                      <p className='text-sm text-muted-foreground'>
                        {isMicDisabled?'Off':"On"}
                      </p>
                    </div>
                    </div>

                 
                  <Switch checked={!isMicDisabled} onCheckedChange={(checked) => setIsMicDisabled(!checked)}/>
                  </div>

                  {/* Device Setting */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                        <SettingsIcon className='h-5 w-5 text-primary'/>
                      </div>

                      <div>
                        <p className='font-medium'>Settings</p>
                        <p className='text-sm text-muted-foreground'>Configure devices</p>
                      </div>
                    </div>
                    <DeviceSettings/>
                  </div>
                </div>

                {/* Join button */}
                <div className='space-y-3 mt-8'>
                  <Button className='w-full' size='lg' onClick={handleJoin}>Join Meeting</Button>
                  <p className='text-xs text-center text-muted-foreground'>
                    Do not worry, out team is super friendly ~~~ We want you to succeed🎉
                  </p>
                </div>
              </div>
          </div>
        </Card>

      </div>
    </div>
   </div>
  )
}

export default MeetingSetup
