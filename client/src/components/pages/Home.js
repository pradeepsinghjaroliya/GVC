import React, { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../context/userContext";
// import "./Home.css";
import Homemain from "./HomeMain";
import Login from "../auth/Login";
// import Register from "../auth/Register";

function Home() {
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!userData.user) navigate("/login");
	// }, []);
	// const userData = true
	return (
		<>
		{userData.user ? (
			<Homemain />
		):(
			<Login/>

		)}
		</>
		// <div className="home">
		// 	{userData.user ? (
		// 		<div className="home-cont">
        //             <Homemain />
		// 		</div>
		// 	) : (
		// 		<>
		// 			<h2>You are not logged in</h2>
		// 			<Link to="/login">Login</Link>
		// 		</>
		// 	)}
		// </div>
	);
}

export default Home;
