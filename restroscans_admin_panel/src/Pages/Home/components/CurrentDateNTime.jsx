import React from 'react'
import Clock from 'react-live-clock';
import "./currentdate.css"

const CurrentDateNTime = () => {

    return (
    <>
    <Clock
    className="display-date"
    //   date={'1997-12-31T14:15:23+01:00'}
      format={'DD - MM - yy'}
      ticking={true}
      timezone={'Asia/Kolkata'} />
    <Clock
    className="display-time"
    //   date={'1997-12-31T14:15:23+01:00'}
      format={'H : mm : ss A'}
      ticking={true}
      timezone={'Asia/Kolkata'} />

      </>);

}

export default CurrentDateNTime