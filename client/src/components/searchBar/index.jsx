import styles from "./styles.module.css";
import { getSearchUsers } from "../../redux/slices/searchUsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import User from "../../assets/icons/user.svg";
import { useEffect } from "react";
import Clear from "../../assets/icons/clear.svg";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function SearchBar({ closeSearchModal }) {
  const { searchedUsers, loading, error } = useSelector(
    (state) => state.searchedUsers
  );
  const [query, setQuery] = useState("");
  const [hasRecent, setHasRecent] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchedUsers?.length > 0) {
      setHasRecent(true); // Если найдены пользователи
    }
  }, [searchedUsers]);

  const navigate = useNavigate();

  async function handleSearch(event) {
    const value = event.target.value;
    setQuery(value); // Обновляем query

    if (value.trim() === "") {
      // Если поле поиска очищено
      setHasRecent(searchedUsers?.length > 0); // Показываем "Recent", если есть найденные ранее
    } else {
      // Выполняем поиск, если есть текст в поле
      setHasRecent(false);
      await dispatch(getSearchUsers(value.trim()));
    }
  }

  function handleClearSearch() {
    setQuery("");
  }

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    closeSearchModal();
  };

  return (
    <div className={styles.modalContainer} onClick={closeSearchModal}>
      <div
        className={styles.searchContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className={styles.header}>Search</h1>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search"
            className={styles.searchInput}
          />
          <img
            src={Clear}
            alt="Clear"
            onClick={handleClearSearch}
            className={styles.clearIcon}
          />
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {query.trim() && searchedUsers?.length === 0 && !loading && !error && (
          <p className={styles.notFoundUsers}>No users found</p>
        )}
        {query.trim() === "" && hasRecent ? (
          <h3 className={styles.recent}>Recent</h3>
        ) : (
          ""
        )}
        {searchedUsers?.length > 0 && (
          <div className={styles.foundUsersContainer}>
            {searchedUsers.map((user) => (
              <div className={styles.foundUser} key={user._id}>
                <img
                  src={user?.avatar || User}
                  alt=""
                  className={styles.avatar}
                  onClick={() => handleUserClick(user._id)}
                />
                <div className={styles.username}>{user?.username}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  closeSearchModal: PropTypes.func.isRequired,
};

export default SearchBar;
