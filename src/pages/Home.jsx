import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { HighlightText } from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"
import { CodeBlocks } from '../components/core/HomePage/CodeBlocks';
import { TimelineSection } from '../components/core/HomePage/TimelineSection';
import { LearningLanguageSection } from '../components/core/HomePage/LearningLanguageSection';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import { InstructorSection } from '../components/core/HomePage/InstructorSection';
import { Footer } from '../components/common/Footer';

const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className='relative mx-auto mt-16 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white'>
            
            {/* Become an instructor Button */}
            <Link to={"/signup"}>
                <div className='group mx-auto w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className='text-center text-4xl font-semibold '>
                Empower Your Future with
                <HighlightText text={'Coding Skills'}/>
            </div>
            
            {/* Sub Heading */}
            <div className='-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>
            
            {/* Buttons */}
            <div className='mt-8 flex flex-row gap-7'>
                <CTAButton active={true} linkto={"/signup"} >
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"} >
                    Book a Demo
                </CTAButton>
            </div>

            {/* Video */}
            <div className='mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200 '>
              <video
                className=" shadow-[20px_20px_rgba(255,255,255)] "
                muted
                loop
                autoPlay
                playsInline
              >
                <source src={Banner} type="video/mp4" />
              </video>
            </div>

            {/* Code section 1  */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row"}
                    heading = {
                        <div className='text-4xl font-semibold'>
                            Unlock Your
                            <HighlightText text={" coding potential "}/>
                            <br/>
                            with our online courses
                        </div>                    
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1= { 
                        {
                            btnText: "Try it Yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2= { 
                        {
                            btnText: "Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }                   
                    
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
                    
                    backgroundColor={"yellow"}
                />
            </div>

            {/* Code section 2  */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading = {
                        <div className='text-4xl font-semibold'>
                            Start
                            <HighlightText text={"coding"} />
                            <br />
                            <HighlightText text={"in seconds"} />
                        </div>                    
                    }
                    subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1= { 
                        {
                            btnText: "Continue Lesson",
                            linkto:"/signup",
                            active:true,
                            shadowColor:true
                        }
                    }
                    ctabtn2= { 
                        {
                            btnText: "Learn More",
                            linkto:"/login",
                            active:false,
                            shadowColor:false
                        }
                    }                   
                    
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
                    
                    backgroundColor={`blue`}
                />
            </div>

            {/* Explore More  */}
            <ExploreMore/>
        </div>    

        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700 '>
           
            <div className='homepage-bg h-[320px]'>
                <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8'>
                    <div className='lg:h-[150px]'></div>
                    
                    <div className='flex flex-row gap-7 text-white lg:mt-8'>
                         <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-2 '>
                                Explore Full Catlog
                                <FaArrowRight/>
                            </div>
                        </CTAButton> 

                        <CTAButton active={false} linkto={"/login"}>
                            Learn More
                        </CTAButton> 
                    </div>
                </div>
            </div>

            <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 '>
                <div className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'>
                    <div className='text-4xl font-semibold lg:w-[45%] '>
                        Get the skills you need for a 
                        <HighlightText text={"job that is in demand"} />
                    </div>
                    
                    <div className='flex flex-col items-start gap-10 lg:w-[40%]'>
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        
                        <CTAButton active={true} linkto={"/signup"}> Learn More</CTAButton>
                    </div>
                </div>
            

                <TimelineSection/>

                <LearningLanguageSection/>
            </div>
        </div>``

        {/* Section 3 */}
        <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            <InstructorSection />

            <h1 className='text-center text-4xl font-semibold mt-8'>Reviews from other learners</h1>

            {/* Review Silder Here */}
        </div>
        

        {/* Footer */}
        <Footer/>
        

    </div>
  )
}

export default Home;