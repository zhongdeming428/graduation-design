import React from 'react';
import { DatePicker } from 'antd';

const dateChange = function(date, dateStr) {
    alert(dateStr);
}

class YieldCurve extends React.Component {
    constructor() {
        super();
        this.dateChange = dateChange.bind(this);
    }
    render() {
        return <div>
            <DatePicker onChange={this.dateChange}/>
        </div>
    }
}

export default YieldCurve;