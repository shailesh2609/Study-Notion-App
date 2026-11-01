import React from 'react';
import { TbBinaryTree2 } from "react-icons/tb";
import { MdPeople } from "react-icons/md";

export const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData.heading)}
      className={`w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer
        ${isActive
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"}`}
    >
      <div className="border-b-2 border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div className={`font-semibold text-[20px] ${
          isActive ? "text-richblack-800" : "text-richblack-25"
        }`}>
          {cardData.heading}
        </div>

        <div className="text-richblack-400">
          {cardData.description}
        </div>
      </div>

      <div className={`flex justify-between px-6 py-3 font-medium ${
        isActive ? "text-blue-300" : "text-richblack-300"
      }`}>
        <div className="flex items-center gap-2 text-[16px]">
          <MdPeople />
          <p>{cardData.level}</p>
        </div>

        <div className="flex items-center gap-2 text-[16px]">
          <TbBinaryTree2 />
          <p>{cardData.lessionNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};