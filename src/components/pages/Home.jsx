import React from 'react'
import {useNavigate } from 'react-router-dom';
import { useToastContext } from '../toastContext';
import { useQuery } from '@apollo/client';
import { parseMeetingsData } from '../../util';
import { GET_ALL_DATA } from '../../queries';


export function Home() {
    const navigate = useNavigate();
    const {handleError} = useToastContext();
    const {data, error, loading} = useQuery(GET_ALL_DATA, {
        onError: ()=> {
            handleError("Unable to fetch building data");
        }
    });

    const handleButtonClick = () => navigate('/add-meeting');

    if (loading) return (<>Loading</>)
    if (error) return (<>Something Went Wrong</>)
    
    const {
        meetingRoomTotalCount,
        occupiedMeetingRoomsCount,
        meetingTotalCount,
        onGoingMeetingsCount
    } = parseMeetingsData(data);
    
    return (
        <div className='home-page'>
            <div className='building-data'>
                <div id='buildings-metadata' className='metadata-fields'>
                    <h3>Buildings</h3>
                    <p>Total {data.Buildings.length}</p>
                </div>
                <div id='rooms-metadata'  className='metadata-fields'>
                    <h3>Rooms</h3>
                    <p>Total {meetingRoomTotalCount}</p>
                    <p>Free Now {meetingRoomTotalCount-occupiedMeetingRoomsCount}</p>
                </div>
                <div id='meetings-metadata'className='metadata-fields'>
                    <h3>Meetings</h3>
                    <p>Total {meetingTotalCount} Today</p>
                    <p>Total {onGoingMeetingsCount} Going on Now</p>
                </div>
            </div>
            <div className='button-wrapper'>
                <button className='add-meeting-btn' onClick={handleButtonClick}>Add a Meeting</button>
            </div>
        </div>
    )
}