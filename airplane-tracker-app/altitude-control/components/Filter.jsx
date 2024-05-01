import "./Filter.css"
import React, { useState } from 'react';

function Filter({ setSelectedFilter }) {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedFilter(event.target.value);
        setSelectedValue(event.target.value);
    };

    return (
        <div className='filter-container'>
            <h1 className="header">Filter Altitude:</h1>
            <select className="options" value={selectedValue} onChange={handleChange}>
                <option value="No Filter"> No Filter </option>
                <option value="> 300 ft">&gt; 300 ft </option>
                <option value="300 ft - 150 ft">300 ft - 150 ft</option>
                <option value="< 150 ft">&lt; 150 ft</option>
            </select>
            {selectedValue && <div className="selection">Filtering for Airplanes: {selectedValue}</div>}
        </div>
    );
}

export default Filter;