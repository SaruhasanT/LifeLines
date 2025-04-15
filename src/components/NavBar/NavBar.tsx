import { useEffect, useRef, useState } from "react";
import searchIcon from "../../assets/icons/search.svg";
import "./NavBar.scss";
import logo from "../../assets/logo/Logo1.png";
import writeIcon from "../../assets/icons/write.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import userIcon from "../../assets/icons/user.png";
import profileIcon from "../../assets/icons/profile.svg";
import storiesIcon from "../../assets/icons/stories.svg";
import statsIcon from "../../assets/icons/stats.svg";
import libraryIcon from "../../assets/icons/library.svg";
import { removeUser } from "../../state/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../state/store";
const NavBar = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);
  const [profileDD, setProfileDD] = useState(false);
  const navigate = useNavigate();

  interface profileItemsInterface {
    content: string;
    icon: string;
    action: () => void;
  }
  const profileDropDownItems: profileItemsInterface[] = [
    {
      content: "Profile",
      icon: profileIcon,
      action: () => {
        let id = "";
        for (let i = 0; userState.email[i] != "@"; i++) {
          id += userState.email[i];
        }
        navigate("me");
      },
    },
    { content: "Library", icon: libraryIcon, action: () => {} },
    { content: "Stories", icon: storiesIcon, action: () => {} },
    { content: "Stats", icon: statsIcon, action: () => {} },
  ];

  return (
    <div className="nav__bar">
      <div className="left">
        <img className="logo__img" src={logo} alt="" />
        <div>
          <img className="search__icon" src={searchIcon} alt="" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <img className="write__icon icon" src={writeIcon} alt="" />
          </li>
          <li>
            <img
              className="notification__icon icon"
              src={notificationIcon}
              alt=""
            />
          </li>
          <li className="user">
            <DropDown
              profileDD={profileDD}
              setProfileDD={setProfileDD}
              items={profileDropDownItems}
            />
            <img
              onClick={() => {
                setProfileDD(true);
              }}
              className="icon user__icon"
              src={userIcon}
              alt=""
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};
interface props {
  items: {
    content: string;
    icon: string;
    action: () => void;
  }[];
  profileDD: boolean;
  setProfileDD: (state: boolean) => void;
}

const DropDown = ({ items, profileDD, setProfileDD }: props) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function closeDropDown(e: MouseEvent | any) {
      if (
        dropDownRef.current &&
        !dropDownRef.current?.contains(e.target as Node)
      ) {
        setProfileDD(false);
      }
    }
    document.addEventListener("mousedown", (e) => {
      closeDropDown(e);
    });
  }, []);
  const dispatch = useDispatch();
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Successfull");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      {profileDD && (
        <div ref={dropDownRef} className="dropdown">
          <ul>
            {items.map((item, i) => {
              return (
                <li
                  key={i}
                  className="dropdown__li"
                  onClick={() => {
                    item.action();
                  }}
                >
                  <span>
                    <img className="li__icon" src={item.icon} alt="" />
                  </span>
                  <span>{item.content}</span>
                </li>
              );
            })}
          </ul>
          <hr />
          <ul>
            <li className="drop__li">Settings</li>
            <li
              className="drop__li"
              onClick={() => {
                dispatch(removeUser());
                signOutUser();
              }}
            >
              Log Out
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
export default NavBar;
