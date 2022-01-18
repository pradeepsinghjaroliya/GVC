import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import "./Navbar.css";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
	const { userData, setUserData } = useContext(UserContext);
	const [click, setClick] = useState(false);

	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	const logout = () => {
		setUserData({
			token: undefined,
			user: undefined,
		});
		localStorage.setItem("auth-token", "");
	};

	return (
		<>
			<nav className="navbar">
				<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
					<AcUnitIcon id="company-logo" />
					<h4 className="company-name">GVC</h4>
				</Link>
				<div className="menu-icon" onClick={handleClick}>
					{click ? <CloseIcon /> : <MenuIcon />}
				</div>
				<ul className={click ? "nav-menu active" : "nav-menu"}>
					<li className="nav-item">
						<Link to="/" className="nav-links" onClick={closeMobileMenu}>
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link
							to="/about-us"
							className="nav-links"
							onClick={closeMobileMenu}
						>
							About Us
						</Link>
					</li>
					
					{!!userData.user && (
                    <li className="nav-item">
							<div className="nav-user">{userData.user.displayName}</div>
					</li>
						)}
					<li className="nav-item ">
						<div className="nav-links-btn" onClick={closeMobileMenu}>
							{userData.user ? (
								<button className="logout-btn" onClick={logout}>
									Logout
								</button>
							) : (
								<>
									<Link to="/login" className=" sign-in-btn">
										Sign-In
									</Link>
								</>
							)}

							{/*!!user.email && (
									<button
									className="nav-links-btn logout-btn" onClick={() => logout()}>Log out</button>
							)}
							{!user.email && <Link
							to="/login" className="nav-links-btn sign-in-btn"
						>
							Sign-In
                            </Link>*/}
						</div>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
