import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

import {
  AiOutlineSlackSquare,
  AiOutlineSlack,
  AiOutlineMenuUnfold,
  AiOutlineMenu,
  AiFillMail,
  AiFillPhone,
} from "react-icons/ai";

import img3 from "../assets/pic1.jpg";
import img2 from "../assets/pic2.jpg";
import img4 from "../assets/pic3.png";
import img1 from "../assets/pic4.png";

export default function Header() {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setToggle(!toggle);
  };

  const handleLogin = () => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      localStorage.removeItem("userEmail");
      alert("Logged out successfully!");
      window.location.reload();
    } else {
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <div className=" ">
      <div className=" bg-[white] p-1 rounded-b max-w-[1300px] items-center flex flex-row justify-between border-b mx-auto ">
        <div className=" flex flex-row text-[11px] space-x-2 ">
          <ul className=" font-semibold   hover:text-[blue]  ">
            <a href="/">
              <li>
                <h1>भारत सरकार</h1>
              </li>
              <li>
                <h1>GOVERNMENT OF INDIA</h1>
              </li>
            </a>
          </ul>
          <ul className=" font-semibold  hover:text-[blue]  ">
            <a href="">
              <li>
                <h1>गृह मंत्रालय</h1>
              </li>
              <li>
                <h1>MINISTRY OF HOME AFFAIRS</h1>
              </li>
            </a>
          </ul>
        </div>

        <div>
          <button
            onClick={handleLogin}
            className=" bg-[#2bfff457] rounded-2xl p-3 drop-shadow-2xl shadow-2xl"
          >
            {localStorage.getItem("userEmail") ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      <div
        className="header-container 
     max-w-[1250px] mx-auto p-3 bg-[#ffffff] shadow-[#b7a9eb63] border sticky z-50 top-0 flex justify-between items-center duration-300 shadow-2xl rounded-br-3xl rounded-bl-3xl"
      >
        {toggle ? (
          <AiOutlineSlackSquare
            onClick={toggleMenu}
            className="md:hidden block text-[50px] text-[#000000]"
          />
        ) : (
          <AiOutlineSlack
            onClick={toggleMenu}
            className="md:hidden block text-[50px] text-[#000000]"
          />
        )}

        <ul className="hidden md:flex  text-[#000000] justify-center items-center flex-row gap-5 text-[16px] font-bold">
          <div className="headimg flex flex-row  space-x-2 ">
            <img src={img1}></img>
            <img src={img2}></img>
          </div>
        </ul>

        <ul className=" font-semibold text-xl  ">
          <li>
            <h1>राजस्थान साइबर अपराध रिपोर्टिंग पोर्टल</h1>
          </li>
          <li>
            <h1>Rajasthan Cyber Crime Reporting Portal</h1>
          </li>
        </ul>
        <ul className="hidden md:flex    text-[#000000] justify-center items-center flex-row gap-5 text-[16px] font-bold">
          <div className="headimg flex flex-row space-x-5">
            <img src={img3}></img>
            <img src={img4}></img>
          </div>
        </ul>

        <ul
          className={`responsive md:hidden text-black fixed w-[100%] h-[100%] top-20 bg-white justify-center items-center flex-row gap-5 text-[16px] font-bold ${
            toggle ? "left-[0]" : "left-[-100%]"
          }`}
        >
          <li
            onClick={toggleMenu}
            className="p-3 hover:scale-110 duration-300 ease-in-out justify-center flex hover:text-[#4f47c5]"
          >
            <div
              onClick={toggleMenu}
              to="main"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Home
            </div>
          </li>
          <li
            onClick={toggleMenu}
            className="p-3 hover:scale-110 duration-300 ease-in-out justify-center flex hover:text-[#4f47c5]"
          >
            <div
              onClick={toggleMenu}
              to="about"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              About Me
            </div>
          </li>
          <li
            onClick={toggleMenu}
            className="p-3 hover:scale-110 duration-300 ease-in-out justify-center flex hover:text-[#4f47c5]"
          >
            <div
              onClick={toggleMenu}
              to="experience"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Experience
            </div>
          </li>
          <li
            onClick={toggleMenu}
            className="p-3 hover:scale-110 duration-300 ease-in-out justify-center flex hover:text-[#4f47c5]"
          >
            <div
              onClick={toggleMenu}
              to="Project"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Project
            </div>
          </li>
          <li
            onClick={toggleMenu}
            className="p-3 hover:scale-110 duration-300 ease-in-out justify-center flex bg-[white] rounded-2xl text-[black] hover:text-[#4f47c5]"
          >
            <a
              onClick={toggleMenu}
              href="https://drive.google.com/file/d/1q4v0DQFQah3rBiRzL0-VRezWob5miEC3/view"
            >
              Resume
            </a>
          </li>
        </ul>
      </div>

      <div className=" bg-[#00ffd567] max-w-[1220px] rounded-b-2xl flex items-start   mx-auto">
        <ul className="  flex flex-start space-x-4 p-1">
          <li className=" p-2 w-[40px] justify-center items-center flex bg-[white] rounded-2xl drop-shadow-2xl hover:scale-105 ease-in-out">
            <Link to="/" className="">
              <AiFillHome />
            </Link>
          </li>
          <li className=" p-2  bg-[white] rounded-2xl drop-shadow-2xl hover:scale-105 ease-in-out">
            <Link to="">About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
