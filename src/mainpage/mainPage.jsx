import '../App.css';
import React, { useState, useEffect } from 'react';
import { imageDB } from '../../firebase';
import { ref } from 'firebase/storage';

export default function MainPage() {
  const [activeTag, setActiveTag] = useState('home');

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  return (
    <div className="MainPage">
      <HeaderMainPage activeTag={activeTag} handleTagClick={handleTagClick} />
      <MainScreenDecider activeTag={activeTag} />
    </div>
  );
}

function HeaderMainPage({ activeTag, handleTagClick }) {
  const usernameheader = localStorage.getItem('username');
  const useremailheader = localStorage.getItem('useremail');
  const userimageheader = localStorage.getItem('userphoto');

  return (
    <div className="Header">
      <div className="firstContainer">
        <div className="logo">
          <img
            src="pintrestlogo.png"
            alt="pintrestLogo"
            className="headerLogo"
          />
        </div>
        <div
          className={`tag ${activeTag === 'home' ? 'activetag' : ''}`}
          id="hometag"
          onClick={() => handleTagClick('home')}
        >
          Home
        </div>
        <div
          className={`tag ${activeTag === 'explore' ? 'activetag' : ''}`}
          id="Exploretag"
          onClick={() => handleTagClick('explore')}
        >
          Explore
        </div>
        <div
          className={`tag ${activeTag === 'create' ? 'activetag' : ''}`}
          id="Createtag"
          onClick={() => handleTagClick('create')}
        >
          Create
        </div>
      </div>
      <div className="secondContainer">
        <input
          type="text"
          name="search"
          id="Searchbar"
          className="searchBar"
          placeholder="Search"
        />
      </div>
      <div className="thirdContainer">
        <div className="notification">
          <img
            src="notification.png"
            alt="notification"
            className="thirdsectionimage"
          />
        </div>
        <div className="notification">
          <img
            src="chat.png"
            alt="notification"
            className="thirdsectionimage"
          />
        </div>
        <div className="userprofileimage">
          <img
            src={userimageheader}
            alt="userimage"
            className="userprofileimage"
          />
        </div>
        <div className="notification">
          <img src="down.png" alt="notification" className="downarrow" />
        </div>
      </div>
    </div>
  );
}

function MainScreenDecider({ activeTag }) {
  return activeTag === 'home' ? (
    <HomePage />
  ) : activeTag === 'explore' ? (
    <ExplorePage />
  ) : (
    <CreatePage />
  );
}

function HomePage() {
  const [items, setItems] = useState([]);

  // Dummy data for items
  const dummyData = [
    { id: 1, text: 'Item 1', height: 200 },
    { id: 2, text: 'Item 2', height: 150 },
    { id: 3, text: 'Item 3', height: 230 },
    { id: 4, text: 'Item 4', height: 180 },
    { id: 5, text: 'Item 5', height: 220 },
    { id: 6, text: 'Item 6', height: 190 },
    { id: 7, text: 'Item 7', height: 210 },
    { id: 8, text: 'Item 8', height: 240 },
    { id: 9, text: 'Item 9', height: 170 },
    { id: 10, text: 'Item 10', height: 200 },
  ];

  useEffect(() => {
    // Update items state with dummy data
    setItems(dummyData);
  }, []);

  // Calculate column heights
  const columns = [[], [], [], [], [], []]; // Initialize empty columns
  items.forEach((item, index) => {
    const shortestColumnIndex = columns.reduce(
      (acc, col, idx) => (col.length < columns[acc].length ? idx : acc),
      0
    );
    columns[shortestColumnIndex].push(item);
  });

  return (
    <div className="homepage">
      {columns.map((column, index) => (
        <div key={index} className="column">
          {column.map((item) => (
            <div
              key={item.id}
              className="imagediv"
              style={{ height: `${item.height}px` }}
            >
              {item.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExplorePage() {
  return <div>Explorepage</div>;
}

function CreatePage() {
  const [image, setImage] = useState(null);
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);

    // Optionally, you can also preview the selected image
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataURL = reader.result;
      // Do something with the image data URL if needed
    };
    reader.readAsDataURL(selectedFile);
  };
  const placeholderimage =
    'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

  const uploadpost = () => {
    console.log('submitted Succesfully');
  };

  return (
    <div className="createpage">
      <div className="createpinhead">
        <div className="headtext">Create Pin</div>
        <div className="publishbutton" onClick={uploadpost}>
          Publish
        </div>
      </div>
      <div className="uploaddiv">
        <div className="uploadimagediv">
          <div className="displaydiv">
            {image ? (
              <div className="displaydiv">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  className="displayimage"
                />
              </div>
            ) : (
              <div className="displaydiv">
                <img
                  src={placeholderimage}
                  alt="Placeholder"
                  className="displayimage"
                />
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="chooseimagebutton"
          />
        </div>
        <div className="uploaddetailsdiv">
          <div class="input-group title">
            <label class="label">Title</label>
            <input
              autocomplete="off"
              name="Email"
              id="title"
              class="input"
              type="email"
            />
            <div></div>
          </div>
          <div class="input-group title">
            <label class="label">Description</label>
            <textarea
              autocomplete="off"
              name="Email"
              id="description"
              class="input"
              type="email"
              draggable
            />
            <div></div>
          </div>
          <div class="input-group title">
            <label class="label">Link</label>
            <input
              autocomplete="off"
              name="Email"
              id="link"
              class="input"
              type="email"
            />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
