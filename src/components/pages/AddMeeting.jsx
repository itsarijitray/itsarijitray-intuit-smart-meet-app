import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { Fragment, useRef, useState } from 'react'
import { ADD_MEETING, GET_ALL_MEETING_ROOM_BY_BUILDINGID } from '../../queries';
import { BuildingSelector } from '../BuildingSelector';
import { useToastContext } from '../toastContext';

export function AddMeeting() {
    const [meetingTitle, setTitle] = useState('');
    const [meetingDate, setDate] = useState('');
    const [meetingStartTime, setStartTime] = useState('');
    const [meetingEndTime, setEndTime] = useState('')
    const [building, setbuilding] = useState();
    const [getData]=useLazyQuery(GET_ALL_MEETING_ROOM_BY_BUILDINGID);
    const [addMeeting] = useMutation(ADD_MEETING);
    const radioGroupRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [meetingRoomID, setMeetingRoomID] = useState('');
    const [dialogOptions, setDialogOptions] = useState([])
    const minDate = new Date().toISOString().slice(0, -14);
    const {handleSuccess, handleError, handleInfo} = useToastContext();

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
          radioGroupRef.current.focus();
        }
    };

    const handleOnChange = (event) => {
        setMeetingRoomID(event.target.value);
    };

    const handleBuildingChange = (el) => {
        setbuilding(el)
    }

    const handleOK = () => {
        setModalOpen(false);
        addMeeting({variables:{
            id: Math.floor((Math.random() * 10000) + 1),
            title: meetingTitle,
            date: new Date(meetingDate).toLocaleDateString('en-GB'),
            startTime: meetingStartTime,
            endTime: meetingEndTime,
            meetingRoomId: parseInt(meetingRoomID)
        }}).then(()=> {
            handleSuccess("Successfully added the meeting");
        }).catch((error)=> {
            console.error(error);
            handleError("Unable to add meeting");
        });
    };

    function handleFormSubmit(event) {
        event.preventDefault();
        getData({variables: {
            id: building
        }}).then(response =>{
            if(response.data?.Building?.meetingRooms.length>0){
                setDialogOptions(response.data?.Building?.meetingRooms)
                setModalOpen(true);
            }
            else {
                handleInfo("No meeting rooms found for this Building. Please Select other options.");
                setModalOpen(false)
            }
        }).catch((error) => {
            console.error(error);
            handleError("Unable to get meeting rooms data");
        });
    }
    return (
        <Fragment>
            <div className='home-page'>
                <h2 className='header'>Add Meeting</h2>
                <form className='add-meeting-form' onSubmit={handleFormSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td className='label-column'>Date</td>
                                <td>
                                    <input type="date" 
                                        className='input-item' 
                                        value={meetingDate}
                                        min={minDate} 
                                        onChange={(event)=>setDate(event.target.value)} 
                                        required={true}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='label-column'>Title</td>
                                <td>
                                    <input 
                                        type="text" 
                                        className='input-item' 
                                        value={meetingTitle} 
                                        onChange={(event)=>setTitle(event.target.value)} 
                                        required={true} />
                                </td>
                            </tr>
                            <tr>
                                <td className='label-column'>Start Time</td>
                                <td>
                                    <input 
                                        type="time" 
                                        className='input-item' 
                                        value={meetingStartTime}
                                        required={true}
                                        max={meetingEndTime} 
                                        onChange={(event)=>setStartTime(event.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td className='label-column'>End Time</td>
                                <td>
                                    <input 
                                        type="time" 
                                        className='input-item' 
                                        value={meetingEndTime}
                                        min={meetingStartTime}
                                        max={"23:59"}
                                        required={true} 
                                        onChange={(event)=>setEndTime(event.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td className='label-column'>Select Building</td>
                                <td>
                                    <BuildingSelector 
                                        onBuildingSelect={handleBuildingChange} 
                                    >
                                    </BuildingSelector>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <input className='add-meeting-btn' type="submit" value="Next"></input>
                </form>
            </div>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, border:"2px solid #37FE37"}}}
                maxWidth="xs"
                TransitionProps={{ onEntering: handleEntering }}
                open={isModalOpen}
            >
            <DialogTitle sx={{textAlign: "center"}}>Please Select One of the free Rooms</DialogTitle>
            <DialogContent dividers sx={{padding: "unset", border: "unset"}}>
                <RadioGroup
                ref={radioGroupRef}
                aria-label="roomd"
                name="rooms-dialog"
                value={meetingRoomID}
                onChange={handleOnChange}
                >
                {dialogOptions.map((option, index) => (
                    <FormControl key={"form-control"+index} sx={{ p: 2, flexDirection: 'row', gap: 2, marginTop:"1%", border:"2px solid #37FE37"}}>
                        <Radio key={option.id} value={option.id}/>
                        <div>
                            <FormLabel key={option.name}>{option.name}</FormLabel>
                            <FormHelperText key={"building"+index}>Building {building} </FormHelperText>
                            <FormHelperText key={option.floor}>Floor {option.floor} </FormHelperText>
                        </div>
                    </FormControl>
                ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions sx={{justifyContent: "center"}}>
                <Button disabled={meetingRoomID.length<1} sx={{backgroundColor: "#2525faac", color: "unset"}} onClick={handleOK}>Save</Button>
            </DialogActions>
            </Dialog>
        </Fragment>
    )
}
