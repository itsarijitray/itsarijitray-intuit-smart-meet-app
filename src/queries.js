import { gql } from "@apollo/client";


export const GET_ALL_BUILDINGS = gql`
    {
        Buildings {
            name
            id
        }
    } 
`

export const GET_ALL_MEETING_ROOM_BY_BUILDINGID = gql`
    query getMeetingRoomDataByBuildingId($id: Int!) {
        Building (id: $id) {
            name
            id
            meetingRooms {
                id
                name
                floor
                meetings {
                    date
                    startTime
                    endTime
                }
            }
        }
    }
`
export const GET_ALL_DATA = gql`
    {
        Buildings {
            name
            id
            meetingRooms {
                name
                id
                meetings {
                    date
                    startTime
                    endTime
                }
            }
        }
    }
`

export const ADD_MEETING = gql`
    mutation addMeeting(
            $id: Int!
            $title: String!
            $date: String!
            $startTime: String!
            $endTime: String!
            $meetingRoomId: Int! 
        ) {
        Meeting(
            id: $id
            title: $title 
            date: $date
            startTime: $startTime
            endTime: $endTime
            meetingRoomId: $meetingRoomId
        ) {
            id
            title
        }
    }
`
