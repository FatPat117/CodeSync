"use client";
import useMeetingActions from "@/hooks/useMeetingAction";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
interface MeetingModalProps {
        isOpen: boolean;
        onClose: () => void;
        title: string;
        isJoinMeeting: boolean;
}

const MeetingModal = ({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) => {
        const [meetingUrl, setMeetingUrl] = useState<string>("");
     const {createInstantMeeting, joinMeeting} = useMeetingActions();
        const handleStartMeeting = async () => {
                if(isJoinMeeting){
                        // If it's a URL, extract the meeting ID
                        const meetingId = meetingUrl.split("/").pop();
                        if(meetingId){
                                joinMeeting(meetingId as string);
                        }
                }else{
                        createInstantMeeting();
                }
                setMeetingUrl('');
                onClose();
        };

        return (
                <Dialog open={isOpen} onOpenChange={onClose}>
                        <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                        <DialogTitle>{title}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4 pt-4">
                                        {isJoinMeeting ? (
                                                <Input
                                                        placeholder="Paste meeting link here..."
                                                        value={meetingUrl}
                                                        onChange={(e) => setMeetingUrl(e.target.value)}
                                                />
                                        ) : null}

                                        <div className="flex justify-end gap-3">
                                                <Button variant={"outline"} onClick={onClose}>
                                                        Cancel
                                                </Button>
                                                <Button
                                                        onClick={handleStartMeeting}
                                                        disabled={isJoinMeeting && !meetingUrl.trim()}
                                                >
                                                        {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
                                                </Button>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};

export default MeetingModal;
