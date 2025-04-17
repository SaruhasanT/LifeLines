import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import "./EditForm.scss";
import { updateDisplayName } from "../../state/userSlice";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../assets/icons/user.png";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { RootState } from "../../state/store";
interface props {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}
const EditForm = ({ isOpen, setIsOpen }: props) => {
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(
    auth.currentUser?.displayName || "LifeLines User"
  );
  const nameRef = useRef(null);
  const updateUserName = async (uid: string, newName: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "users", document.id);
      await updateDoc(docRef, {
        name: newName,
      });
    });
  };
  const updateUserProfile = () => {
    if (!auth.currentUser) return;
    updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: "https://example.com/jane-q-user/profile.jpg",
    })
      .then(() => {
        dispatch(updateDisplayName({ displayName: fullName }));
        updateUserName(userState.uid, fullName);
        console.log("Profile Updated");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    function closeEditForm(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", (e) => {
      closeEditForm(e);
    });
  }, []);
  return (
    <div className={`edit__form ${isOpen ? "show " : null}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action=""
        ref={formRef}
      >
        <h1>Profile Information</h1>
        <div>
          <label className="label">Photo</label>
          <div className="photo__line">
            <div>
              <img className="profile__picture" src={userIcon} alt="" />
            </div>
            <div>
              <div>
                <button className="btn update__btn">Update</button>
                <button className="btn remove__btn">Remove</button>
              </div>
              <p>
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                side.
              </p>
            </div>
          </div>
        </div>
        <div className="input__container">
          <label htmlFor="">Name*</label>
          <input
            ref={nameRef}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            type="text"
          />
        </div>
        <div className="input__container">
          <label htmlFor="">Genre</label>
          <input type="text" />
        </div>
        <div className="input__container">
          <label htmlFor="">Bio</label>
          <textarea rows={3} name="bio" id="bio" className="bio" />
        </div>
        <div className="footer__btns">
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="cancel__btn btn"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateUserProfile();
              setIsOpen(false);
            }}
            className="save__btn btn"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
