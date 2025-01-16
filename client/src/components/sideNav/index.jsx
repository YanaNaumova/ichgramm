import { NavLink } from "react-router-dom";
import Create from "../../assets/icons/create.svg";
import Explore from "../../assets/icons/explore.svg";
import Home from "../../assets/icons/home.svg";
import Like from "../../assets/icons/like.svg";
import Message from "../../assets/icons/message.svg";
import Search from "../../assets/icons/search.svg";
import User from "../../assets/icons/user.svg";
import styles from "./styles.module.css";
import Logo from "../../assets/icons/logo.svg";
import { useState } from "react";
import CreateNewPost from "../createNewPost";
import { useSelector } from "react-redux";

function SideNav() {
  const [activeLink, setActiveLink] = useState("/home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const getClassName = (link) =>
    activeLink === link ? styles.activeLink : styles.link;
  return (
    <nav className={styles.sideNavContainer}>
      <img src={Logo} alt="logo" className={styles.logoImg} />
      <NavLink
        to="/home"
        onClick={() => handleLinkClick("/home")}
        className={getClassName("/home")}
      >
        <img src={Home} alt="home" className={styles.icons} />
        <span className={styles.spanText}>Home</span>
      </NavLink>
      <NavLink
        to="/search"
        onClick={() => handleLinkClick("/search")}
        className={getClassName("/search")}
      >
        <img src={Search} alt="search" className={styles.icons} />
        <span className={styles.spanText}>Search</span>
      </NavLink>
      <NavLink
        to="/explore"
        onClick={() => handleLinkClick("/explore")}
        className={getClassName("/explore")}
      >
        <img src={Explore} alt="explore" className={styles.icons} />
        <span className={styles.spanText}>Explore</span>
      </NavLink>
      <NavLink
        to="/messages"
        onClick={() => handleLinkClick("/message")}
        className={getClassName("/message")}
      >
        <img src={Message} alt="message" className={styles.icons} />
        <span className={styles.spanText}>Message</span>
      </NavLink>
      <NavLink
        to="/notifications"
        onClick={() => handleLinkClick("/notifications")}
        className={getClassName("/notifications")}
      >
        <img src={Like} alt="notifications" className={styles.icons} />
        <span className={styles.spanText}>Notifications</span>
      </NavLink>
      <NavLink
        onClick={(e) => {
          e.preventDefault();
          openModal();
          handleLinkClick("/create");
        }}
        className={getClassName("/create")}
      >
        <img src={Create} alt="create" className={styles.icons} />
        <span className={styles.spanText}>Create</span>
      </NavLink>
      <NavLink
        to="/profile"
        onClick={() => handleLinkClick("/profile")}
        className={getClassName("/profile")}
      >
        <img
          src={user?.avatar || User}
          alt="profile"
          className={styles.icons}
        />
        <span className={styles.spanText}>Profile</span>
      </NavLink>
      {isModalOpen && <CreateNewPost closeModal={closeModal} />}
    </nav>
  );
}

export default SideNav;
