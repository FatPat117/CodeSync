import { TIME_SLOTS } from "@/constants";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../convex/_generated/api";
import UserInfo from "./UserInfo";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

const InterviewScheduleUI = () => {
  const client = useStreamVideoClient();
  const {user} = useUser();
  const [open,setOpen] = useState(false);
  const [isCreatingInterview,setIsCreatingInterview] = useState(false);

  const interviews = useQuery(api.interview.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers);
  const createInterview = useMutation(api.interview.createInterview);

  const candidates = users?.filter((user) => user.role === "candidate") ?? [];
  const interviewers = users?.filter((user) => user.role === "interviewer");

  const [formData,setFormData] = useState({
    title:'',
    description:'',
    date:new Date(),
    time:"09:00",
    candidateId:'',
    interviewerIds:user?.id ? [user.id] : []
  })

  const scheduleMeeting = async () =>{
    if(!client || !user) return;
    if(!formData.candidateId || formData.interviewerIds.length === 0){
      toast.error('Please select both candidate and at least on interviewer');
      return
    }

    setIsCreatingInterview(true);
    try {
        const {title,description,date,time,candidateId,interviewerIds} = formData;
        const [hours,minutes] = time.split(':')
        const meetingDate = new Date(date);
        meetingDate.setHours(parseInt(hours),parseInt(minutes),0,0);
        const id = crypto.randomUUID()
        const call = client.call("default",id); // Create default call with random UUID

        await call.getOrCreate({
          data:{
            starts_at:meetingDate.toISOString(),
            custom:{
              description:description || `Interview: ${title}`,
              addtionalDetails:description || ''
            }
          }
        })


        await createInterview({
          title,
          description,
          startTime:meetingDate.getTime(),
          status:'upcoming',
          streamCallId:call.id,
          candidateId,
          interviewerIds
        });

        setOpen(false);
        toast.success('Meeting Scheduled successfully')
     
    } catch (error) {
      console.log(error);
      toast.error('Failed to schedule meeting')
    }finally{
      setIsCreatingInterview(false)
    }
  }

  const addInterviewer = (interviewerId:string) =>{
    if(!formData.interviewerIds.includes(interviewerId)){
     setFormData((prev) => ({...prev,interviewerIds:[...prev.interviewerIds,interviewerId]}))
    }
  }

  const removeInterviewer = (interviewerId:string) =>{
    setFormData((prev) => ({...prev,interviewerIds:prev.interviewerIds.filter((id) => id !== interviewerId)}))
  } 

  const availableInterviewers = interviewers?.filter((interviewer) => !formData.interviewerIds.includes(interviewer.clerkId)) ?? [];

  const selectedInterviewers = interviewers?.filter((interviewer) => formData.interviewerIds.includes(interviewer.clerkId)) ?? [];
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          {/* Header Info */}
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage interviews</p>
          </div>

          {/* Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size={'lg'}>Schedule Interview</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px] h-[calc(100vh - 200px)] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Interview title state */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Interview title" value={formData.title} onChange={(e) => setFormData((prev) => ({...prev,title:e.target.value}))}/>
                    </div>

                  {/* Interview description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Interview Description" value={formData.description} onChange={(e) => setFormData((prev) => ({...prev,description:e.target.value}))}
                      rows={3}/>
                  </div>

                    {/* Candidate */}
                    <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                    {/* Interviewers */}
                    <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewers.map((interviewer) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <button
                          title="Remove interviewer"
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewers.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((interviewer) => (
                        <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {/* Date & Time */}
              <div className="flex gap-4">
                {/* CALENDAR */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* TIME */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Action button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant={'outline'} onClick={()=>setOpen(false)}>Cancel</Button>
                <Button onClick={scheduleMeeting} disabled={isCreatingInterview}>
                  {isCreatingInterview ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin"/>
                      Scheduling
                    </>
                  ) : 'Schedule Interview'}
                </Button>
              </div>

        </div>
              </DialogContent>
          </Dialog>
        </div>
    </div>
  )
}

export default InterviewScheduleUI
