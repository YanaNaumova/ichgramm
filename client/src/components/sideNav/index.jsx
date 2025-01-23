import { NavLink } from "react-router-dom";
import Create from "../../assets/icons/create.svg";
import Explore from "../../assets/icons/explore.svg";
import ExploreFill from "../../assets/icons/exploreFill.svg";
import Home from "../../assets/icons/home.svg";
import HomeFill from "../../assets/icons/homeFill.svg";
import Like from "../../assets/icons/like.svg";
import LikeFill from "../../assets/icons/likeFill.svg";
import Message from "../../assets/icons/message.svg";
import MessageFill from "../../assets/icons/messageFill.svg";
import Search from "../../assets/icons/search.svg";
import SearchFill from "../../assets/icons/searchFill.svg";
import User from "../../assets/icons/user.svg";
import styles from "./styles.module.css";
import Logo from "../../assets/icons/logo.svg";
import { useState } from "react";
import CreateNewPost from "../createNewPost";
import { useSelector } from "react-redux";
import SearchBar from "../searchBar";

function SideNav() {
  const [activeLink, setActiveLink] = useState("/home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function openSearchModal() {
    setIsSearchModalOpen(true);
  }

  function closeSearchModal() {
    setIsSearchModalOpen(false);
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
        onClick={() => {
          handleLinkClick("/home");
          closeSearchModal();
        }}
        className={getClassName("/home")}
      >
        <img
          src={activeLink === "/home" ? HomeFill : Home}
          alt="home"
          className={styles.icons}
        />
        <span className={styles.spanText}>Home</span>
      </NavLink>
      <NavLink
        onClick={(e) => {
          e.preventDefault();
          openSearchModal();
          handleLinkClick("/search");
        }}
        className={getClassName("/search")}
      >
        <img
          src={activeLink === "/search" ? SearchFill : Search}
          alt="search"
          className={styles.icons}
        />
        <span className={styles.spanText}>Search</span>
      </NavLink>
      <NavLink
        to="/explore"
        onClick={() => {
          handleLinkClick("/explore");
          closeSearchModal();
        }}
        className={getClassName("/explore")}
      >
        <img
          src={activeLink === "/explore" ? ExploreFill : Explore}
          alt="explore"
          className={styles.icons}
        />
        <span className={styles.spanText}>Explore</span>
      </NavLink>
      <NavLink
        to="/messages"
        onClick={() => {
          handleLinkClick("/message");
          closeSearchModal();
        }}
        className={getClassName("/message")}
      >
        <img
          src={activeLink === "/message" ? MessageFill : Message}
          alt="message"
          className={styles.icons}
        />
        <span className={styles.spanText}>Message</span>
      </NavLink>
      <NavLink
        to="/notifications"
        onClick={() => {
          handleLinkClick("/notifications");
          closeSearchModal();
        }}
        className={getClassName("/notifications")}
      >
        <img
          src={activeLink === "/notifications" ? LikeFill : Like}
          alt="notifications"
          className={styles.icons}
        />
        <span className={styles.spanText}>Notifications</span>
      </NavLink>
      <NavLink
        onClick={(e) => {
          e.preventDefault();
          openModal();
          handleLinkClick("/create");
          closeSearchModal();
        }}
        className={getClassName("/create")}
      >
        <img src={Create} alt="create" className={styles.icons} />
        <span className={styles.spanText}>Create</span>
      </NavLink>
      <NavLink
        to="/profile"
        onClick={() => {
          handleLinkClick("/profile");
          closeSearchModal();
        }}
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
      {isSearchModalOpen && <SearchBar closeSearchModal={closeSearchModal} />}
    </nav>
  );
}

export default SideNav;
