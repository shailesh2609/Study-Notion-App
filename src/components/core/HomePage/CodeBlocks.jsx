import React from 'react'
import CTAButton from "../HomePage/Button"
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'


export const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundColor }) => {
  return (
    <div className={` flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>
          
        {/*Section 1*/}
        <div className='w-[100%] lg:w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 text-base font-bold w-[85%] -mt-3 '>
                {subheading}
            </div>
    
            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>
    
                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >  
                        {ctabtn2.btnText}
                </CTAButton>
            </div>
        </div>
    
        {/* Section 2 */}
        <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
        
          {/* Blurred gradient background */}
          <div
            className={`absolute 
                ${backgroundColor === "yellow"
                  ? "codeblock1"
                  : "codeblock2"
              }`}
          />
        
          {/* Index numbers */}
          <div className="text-center flex flex-col
           w-[10%] select-none text-richblack-400 font-inter font-bold ">
            {Array.from({ length: 11 }, (_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>

          {/* Main container: code */}
          <div className="w-[90%] flex flex-col gap-2 font-bold font-mono text-yellow-25 pr-1">
           
              {/* Code block */}
              <div className="w-[90%] flex flex-col gap-2
                font-bold font-mono pr-2">
                <TypeAnimation
                  sequence={[codeblock, 2000, ""]}
                  repeat={Infinity}
                  cursor={true}
                  style={{
                    whiteSpace: "pre-wrap",
                    display: "block",
                  }}
                  omitDeletionAnimation={true}
                />
              </div>
            
          </div>
        </div>
            
    
        </div>
  )
}
