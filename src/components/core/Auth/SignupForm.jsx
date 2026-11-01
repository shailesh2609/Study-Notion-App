import React from 'react'
import {Tab} from '../../common/Tab'
import { useState } from 'react';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { toast } from "react-hot-toast"

export const SignupForm = () => {

  const[accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const[formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    email:'',
    password:'',
    confirmPassword:''
  }) 

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input fields, when some value changes
  const changeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name] : event.target.value
    }))

  }

  // Handle Form Submission
  const handleOnSubmit = (event) => {
    event.preventDefault();

    if(formData.password !== formData.confirmPassword){
      toast.error("Passwords Do Not Match")
      return
    }

    // Dispatch data remaining 
  }

  // Data to be passed to tab Component
  const tabData = [
    {
      id:"1",
      tabName:"Student",
      type:ACCOUNT_TYPE.STUDENT
    },
    {
      id:"2",
      tabName:"Instructor",
      type:ACCOUNT_TYPE.INSTRUCTOR
    }
  ]

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType}/>

      {/* Form  */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className='flex gap-x-4'>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input 
              required
              type='text'
              placeholder='Enter First Name'
              name='firstName'
              value={formData.firstName}
              onChange={changeHandler}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>

          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input 
              required
              type='text'
              placeholder='Enter Last Name'
              name='lastName'
              value={formData.lastName}
              onChange={changeHandler}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>

        <label>
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input 
            required
            type='text'
            placeholder='Enter Email Address'
            name='email'
            value={formData.email}
            onChange={changeHandler}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={changeHandler}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button type='submit' 
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
          Create Account
        </button>
          
      </form>
    </div>
  )
}
