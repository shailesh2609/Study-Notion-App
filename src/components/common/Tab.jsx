import React from 'react'

export const Tab = ({tabData, field, setField}) => {
  return (
    <div className='flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max'
        style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}>
        {
            tabData.map((tab) => {
                return(
                    <button 
                        onClick={() => setField(tab?.type)}
                        key={tab.id}
                        className={`${
                            field === tab.type
                            ? "bg-richblack-900 text-richblack-5"
                            : "bg-transparent text-richblack-200"
                            } py-2 px-5 rounded-full transition-all duration-200`}
                    >
                        {tab?.tabName}
                    </button>
                )
            })
        }
    </div>
  )
}
