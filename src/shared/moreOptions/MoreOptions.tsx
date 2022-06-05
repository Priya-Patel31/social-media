import React from 'react'
import "./moreOptions.css"

const MoreOptions = () => {
  return (
    <div className="moreOptions-container">
        <ul className="list-style-none moreOptions">
            <li className="moreOptions-list-item moreOptions-border font-medium">Edit</li>
            <li className="moreOptions-list-item font-medium">Delete</li>
        </ul>
    </div>
  )
}

export default MoreOptions