import moment from 'moment'

export function generate_token(length){
    if(sessionStorage.getItem('token')){
        return sessionStorage.getItem('token')
    }
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    sessionStorage.setItem('token', b.join(""));
    return b.join("");
}

export function parseMeetingsData (data) {
    const currentDate = moment(new Date());
    let meetingRoomTotalCount = 0;
    let meetingTotalCount = 0;
    let onGoingMeetingsCount = 0;
    let occupiedMeetingRoomsCount = 0;

    if(data["Buildings"].length>0){
        data["Buildings"].forEach(building => {
            meetingRoomTotalCount+=building["meetingRooms"].length
            if(building["meetingRooms"].length > 0) {
                building["meetingRooms"].forEach((meetingRoom) => {
                    if(meetingRoom.meetings.length>0){
                        let isRoomOccupied=false
                        meetingRoom.meetings.forEach((meeting)=>{
                            const meetingStartime = moment(meeting.date+" "+meeting.startTime, 'DD/MM/YYYY hh:mm')
                            const meetingEndtime = moment(meeting.date+" "+meeting.endTime, 'DD/MM/YYYY hh:mm')
                            if(currentDate.isSame(meetingStartime, 'D') && currentDate.isSame(meetingEndtime, 'D')){
                                meetingTotalCount+=1;
                            }
                            if(currentDate.isBetween(meetingStartime, meetingEndtime)) {
                                onGoingMeetingsCount+=1;
                                isRoomOccupied=true
                            }
                        })
                        if(isRoomOccupied){
                            occupiedMeetingRoomsCount+=1
                        }
                    }
                })
            } 
        });
    }

    return {
        meetingRoomTotalCount,
        meetingTotalCount,
        onGoingMeetingsCount,
        occupiedMeetingRoomsCount
    }
}