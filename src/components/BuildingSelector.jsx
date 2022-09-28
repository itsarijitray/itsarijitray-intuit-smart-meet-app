import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client';
import { GET_ALL_BUILDINGS } from '../queries';
import { useToastContext } from './toastContext';

export function BuildingSelector(props) {
    const {handleError} = useToastContext();
    const [buildingId, setbuildingId] = useState();
    const {data, error, loading} = useQuery(GET_ALL_BUILDINGS, {
        onCompleted: (response)=>{
            props.onBuildingSelect(response.Buildings[0].id);
            setbuildingId(response.Buildings[0].id);
        },
        onError: ()=> {
            handleError("Unable to fetch building data");
        }
    });
    if (loading) return (<>Loading</>)
    if (error) return (<>Unable to fetch building data</>)

    const handleChange = (event) => {
        props.onBuildingSelect(parseInt(event.target.value));
        setbuildingId(parseInt(event.target.value));
    };


    return (
        <select onChange={handleChange} >
            {
                data.Buildings.map(el=><option key={el.id} value={el.id}>{el.name}</option>)
            }
        </select>
        
    );
}

BuildingSelector.propTypes = {
    onBuildingSelect: PropTypes.func.isRequired
}