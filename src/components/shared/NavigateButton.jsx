import React from 'react'
import { Link } from 'react-router-dom'

function NavigateButton({text, link, icon}) {
  return (
    <>
        <Link to={link} className="flex items-center bg-headerBg border hover:bg-headerBg/70 dark:hover:bg-primary/30 border-secondaryBg pr-2 ">
            <span className="bg-secondaryBg text-white py-3 px-2 mr-2 text-xl ">{icon}</span>
            <span className="font-bold py-2 px-3 text-white">{text}</span>
        </Link>
    </>
  )
}

export default NavigateButton