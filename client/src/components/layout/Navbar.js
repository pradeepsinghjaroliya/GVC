import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";
// import "./Navbar.css";
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
  // // const testing = true
  // const userData = false ;
  // const displayName = 'Shubham Bhuvad';
  return (
    <>
      {/* navbar opening */}

      {userData.user ? (
        <>
          <nav className="navbar navbar-dark  text-white bg-primary bg-color w-100 px-5 ">
            <a className="navbar-brand">Logo</a>
            <div className="d-flex">
              <div className="mx-5">
                <span className="nav-item  btn ">
                  <Link
                    to="/"
                    className="text-white text-decoration-none"
                  >
                    Home
                  </Link>
                </span>
                <span className="nav-item  btn ">
                  <Link
                    to="/about-us"
                    className="text-white text-decoration-none"
                  >
                    About
                  </Link>
                </span>
              </div>
              <div className="rounded-pill px-4 btn shadow-lg mx-4 bg-light disabled .bg-gradient text-secodanry ">
              {userData.user.displayName}
              </div>
              {/* <button class="mx-4 text-white shadow-lg btn bg-light.bg-gradient rounded-pill">User Name</button> */}
              <Link to="/" className="text-decoration-none text-white">
                <button className="btn btn-outline-light px-4 btn-shadow" type="submit" onClick={logout}>
                  Logout
                </button>
              </Link>
            </div>
          </nav>
        </>
      ) : (
        <>
          <nav className="navbar navbar-light border-bottom bg-light w-100 px-5">
            <a className="navbar-brand">Logo</a>
            <div className="d-flex">
              <div className="mx-5">
                <span className="nav-item btn ">
                  <Link
                    to="/"
                    className="text-dark text-decoration-none"
                  >
                    Home
                  </Link>
                </span>
                <span className="nav-item btn ">
                  <Link
                    to="/about-us"
                    className="text-dark text-decoration-none"
                  >
                    About
                  </Link>
                </span>
              </div>
              <Link to="/" className="text-decoration-none text-white">
                <button className="btn btn-primary px-4 btn-shadow" type="submit">
                  Login
                </button>
              </Link>
            </div>
          </nav>
        </>
      )}
      {/* navbar closing */}
      
      {/* _____________________________________Pradeet code____________________________ */}
      {/* <nav className="navbar">
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

							 {/* !!user.email && (
									<button
									className="nav-links-btn logout-btn" onClick={() => logout()}>Log out</button>
							 )}
							 {!user.email && <Link
							 to="/login" className="nav-links-btn sign-in-btn"
						 >
							Sign-In
               </Link> 
						</div>
					</li>
				</ul>
			</nav>  */}
    </>
  );
}

export default Navbar;
