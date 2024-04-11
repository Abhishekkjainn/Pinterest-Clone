import '../App.css';
import React, { useState, useEffect } from 'react';
import { imageDB } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

export default function MainPage({ setLoggedin }) {
  const [activeTag, setActiveTag] = useState('home');

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  return (
    <div className="MainPage">
      <HeaderMainPage
        activeTag={activeTag}
        handleTagClick={handleTagClick}
        setLoggedin={setLoggedin}
      />
      <MainScreenDecider
        activeTag={activeTag}
        handleTagClick={handleTagClick}
      />
    </div>
  );
}

function HeaderMainPage({ activeTag, handleTagClick, setLoggedin }) {
  const usernameheader = localStorage.getItem('username');
  const useremailheader = localStorage.getItem('useremail');
  const userimageheader = localStorage.getItem('userphoto');
  var menu = false;

  const showmenu = () => {
    menu = !menu;
    if (menu == true) {
      document.getElementById('menubar').style.display = 'flex';
    } else {
      document.getElementById('menubar').style.display = 'none';
    }
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Sign-out successful');
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
        localStorage.removeItem('userphoto');
        setLoggedin(false);
      })
      .catch((error) => {
        // An error occurred
        console.error('Error signing out:', error);
      });
  };

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
          placeholder="🔎 Search"
        />
      </div>
      <div className="thirdContainer">
        <div className="one">
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
            <img
              src="down.png"
              alt="notification"
              className="downarrow"
              onClick={showmenu}
            />
          </div>
        </div>
        <div className="two" id="menubar">
          <div className="personalinfo">
            <div className="personalprofileimage">
              <img
                src={userimageheader}
                alt="userimage"
                className="personalprofileimageimg"
              />
            </div>
            <div className="personaprofiledetails">
              <div className="personalprofilename">{usernameheader}</div>
              <div className="personalprofileemail">{useremailheader}</div>
            </div>
          </div>

          <div className="signoutbutton" onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      </div>
    </div>
  );
}

function MainScreenDecider({ activeTag, handleTagClick }) {
  return activeTag === 'home' ? (
    <HomePage handleTagClick={handleTagClick} />
  ) : activeTag === 'explore' ? (
    <ExplorePage />
  ) : activeTag === 'details' ? (
    <DetailsPage handleTagClick={handleTagClick} />
  ) : (
    <CreatePage />
  );
}

function HomePage({ activeTag, handleTagClick }) {
  const [items, setItems] = useState([]);
  var ind = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the Firestore collection
        const postsCollectionRef = collection(firestore, 'posts');

        // Retrieve documents from the collection
        const querySnapshot = await getDocs(postsCollectionRef);

        // Initialize an array to store fetched data
        const fetchedData = [];

        // Loop through each document and extract data

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            id: ind, // Document ID as unique identifier
            title: data.title,
            accountid: data.email,
            description: data.description,
            displayimageurl: data.imageUrl, // Assuming imageUrl is the field name in your Firestore document
            link: data.link,
            maxht: '450px',
            name: data.displayName,
            likes: data.likes, // Assuming displayName is the field name in your Firestore document
          });
          ind++;
        });

        // Set the state with fetched data
        setItems(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
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

  function savedata(
    img,
    desc,
    title,
    link,
    usernameprev,
    useremailprev,
    docid,
    likes
  ) {
    localStorage.setItem('imageprev', img);
    localStorage.setItem('descriptionprev', desc);
    localStorage.setItem('titleprev', title);
    localStorage.setItem('linkprev', link);
    localStorage.setItem('nameprev', usernameprev);
    localStorage.setItem('emailprev', useremailprev);
    localStorage.setItem('docidprev', docid);
    localStorage.setItem('likesprev', likes);
    handleTagClick('details');
  }

  return (
    <div className="homepage">
      {columns.map((column, index) => (
        <div key={index} className="column">
          {column.map((item) => (
            <div
              key={item.id}
              className="imagediv"
              style={{
                maxWidth: '100%',
              }}
            >
              <img
                src={item.displayimageurl}
                alt={item.name}
                className="displayimageimage"
                onClick={() =>
                  savedata(
                    item.displayimageurl,
                    item.description,
                    item.title,
                    item.link,
                    item.name,
                    item.accountid,
                    item.id,
                    item.likes
                  )
                }
              />
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

/*Complete Create Page*/
let downloadUrl = '';

function CreatePage() {
  const [selectedImage, setSelectedImage] = useState(null);

  var placeholderimage =
    'https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1712620800&semt=sph';

  // var placeholderimage =
  //   'https://firebasestorage.googleapis.com/v0/b/pintrest-clone-f43f5.appspot.com/o/files%2Fautomatevellore%40gmail.com_1cf7dde8-e9b8-4121-8729-7bb6c1537f3e?alt=media&token=fe0c82ae-9f51-43bc-b92d-e6e020f490d2';

  const uploadImageToStorage = async (file) => {
    try {
      // Create a reference to the storage location
      const storageRef = ref(
        imageDB,
        `files/${localStorage.getItem('useremail')}_${uuidv4()}`
      );

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const url = await getDownloadURL(storageRef);

      // Save the download URL to the global variable
      downloadUrl = url;

      // Return the download URL
      console.log(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null; // Return null in case of error
    }
  };
  // Function to handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader object
      reader.onload = async () => {
        setSelectedImage(reader.result); // Set the selected image URL
        const imageUrl = await uploadImageToStorage(file);
        console.log('Download URL:', imageUrl);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const storeDataInFirestore = async (
    title,
    description,
    link,
    imageUrl,
    displayName,
    email,
    likes
  ) => {
    try {
      // Reference to the Firestore collection
      const firestoreCollection = collection(firestore, 'posts');

      // Add a new document with the provided data
      const docRef = await addDoc(firestoreCollection, {
        title: title,
        description: description,
        link: link,
        imageUrl: imageUrl,
        displayName: displayName,
        email: email,
        likes: 0,
      });

      // Log the document ID
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  // Function to handle publishing
  const handlePublish = async () => {
    // Get other data needed for Firestore document
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var link = document.getElementById('link').value;
    var email = localStorage.getItem('useremail');
    var displayName = localStorage.getItem('username');

    if (downloadUrl != '' && title != '' && description != '' && link != '') {
      await storeDataInFirestore(
        title,
        description,
        link,
        downloadUrl,
        displayName,
        email
      )
        .then(() => {
          // Clear input fields after successful upload
          document.getElementById('title').value = '';
          document.getElementById('description').value = '';
          document.getElementById('link').value = '';
          setSelectedImage(null);
          downloadUrl = ''; // Reset download URL
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error('Insufficient Data here to Upload.');
    }
  };

  return (
    <div className="createpage">
      <div className="createpinhead">
        <div className="headtext">Create Pin</div>
        <div className="publishbutton" onClick={handlePublish}>
          Publish
        </div>
      </div>

      <div className="uploaddiv">
        <div className="uploadimagediv">
          {/* Display the selected image */}
          {selectedImage && (
            <div className="displaydiv">
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: '60%',
                  maxHeight: '450px',
                  borderRadius: '20px',
                  marginBottom: '30px',
                }}
              />
            </div>
          )}
          {/* Display a placeholder image if no image is selected */}
          {!selectedImage && (
            <div>
              <img
                src={placeholderimage}
                alt="Placeholder"
                style={{
                  maxWidth: '100%',
                  // maxHeight: '450px',
                  borderRadius: '20px',
                  marginBottom: '30px',
                }}
              />
            </div>
          )}
          {/* File input element */}
          <input
            type="file"
            accept="image/*" // Allow only image files
            onChange={handleFileChange} // Call handleFileChange function when a file is selected
          />
        </div>

        <div className="uploaddetailsdiv">
          <div className="input-group title">
            <label className="label">Title</label>
            <input
              autoComplete="off"
              name="Email"
              id="title"
              className="input"
              type="text"
            />
            <div></div>
          </div>
          <div className="input-group title">
            <label className="label">Description</label>
            <textarea
              autoComplete="off"
              name="Email"
              id="description"
              className="input"
              type="text"
              draggable
            />
            <div></div>
          </div>
          <div className="input-group title">
            <label className="label">Link</label>
            <input
              autoComplete="off"
              name="Email"
              id="link"
              className="input"
              type="text"
            />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsPage({ activeTag, handleTagClick }) {
  return (
    <div className="detailspage">
      <div className="backbuttondetails" onClick={() => handleTagClick('home')}>
        <img src="back.png" alt="" className="backimg" />
      </div>
      <div className="centerdiv">
        <div
          className="imageprevdiv"
          style={{
            backgroundImage: `url(${localStorage.getItem('imageprev')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '50%', // Set width to fill the container
            height: '100%', // Set height to fill the container
          }}
        >
          {/* <img
            src={localStorage.getItem('imageprev')}
            alt={localStorage.getItem('nameprev')}
            className="imgprevimage"
          /> */}
        </div>
        <div className="imagedetailsdiv">
          <div className="detailsprevheader">
            <div className="oneprevheader">
              <img src="upload.png" alt="upload" className="uploadimageimg" />
              <img src="more.png" alt="upload" className="uploadimageimg" />
            </div>
            <div className="twoprevheader">
              <div className="savebutton">Save</div>
            </div>
          </div>

          <div className="linkprev">
            <a href={localStorage.getItem('linkprev')}>
              {localStorage.getItem('linkprev')}
            </a>
          </div>

          <div className="titleprev">{localStorage.getItem('titleprev')}</div>

          <div className="descprev">
            {localStorage.getItem('descriptionprev')}
          </div>

          <div className="profilediv">
            <div className="profone">
              <div className="profilepictureprev"></div>
              <div className="profilenameprev">
                {localStorage.getItem('nameprev')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
