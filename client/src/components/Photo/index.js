import { width } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post, remove } from "../../utils/ApiCaller";
import { useNavigate } from "react-router-dom";
import { Box } from "@material-ui/core";
import axios from "axios";
import { Typography } from "@mui/material";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import ListDialog from "../ListDialog";
// import { post } from "../../utils/ApiCaller";
function CircularProgressWithLabel(props, value) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export default function Photo(props) {
  const [open, setOpen] = useState(false);
  console.count();
  let navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sharedWith, setSharedWith] = useState([]);
  const [progress, setProgress] = useState(0);
  const [maximum, setMaximum] = useState(20);
  //get params albumId from url
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState("");
  const observer = useRef();
  useEffect(() => {
    get("/album/" + albumId)
      .then((res) => {
        setAlbum(res.data.content);
        setPhotos(res.data.content.photos);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);
  const [allFiles, setAllFiles] = useState([]);
  const dummyElementRef = useCallback(
    (element) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (maximum < photos.length) setMaximum(maximum + 10);
        }
      });
      if (element && maximum < photos.length) observer.current.observe(element);
    },
    [maximum, photos.length]
  );
  //return multiple cards to show all albums
  const uploadMultipleFiles = (e) => {
    setAllFiles(e.target.files);
  };
  const uploadPhoto = (e) => {
    e.preventDefault();
    const formData = new FormData();
    let count = 0;
    //check if file is png, jpg, jpeg
    for (let i = 0; i < allFiles.length; i++) {
      if (allFiles[i].type === "image/png" || allFiles[i].type === "image/jpg" || allFiles[i].type === "image/jpeg") {
        // {
        //   formData.append("files", allFiles[i]);
        //   count++;
        // }
        formData.append("files", allFiles[i]);
        count++;
      }
    }
    console.log("countFiles", allFiles.length);
    console.log("count", count);
    axios
      .post(process.env.REACT_APP_ROOT_API_URL + "/album/" + albumId, formData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setProgress(percent);
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setAllFiles([]);
        //f5
        window.location.reload();
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };
  const deletePhoto = (photoId) => {
    remove("/album/" + albumId + "/" + photoId)
      .then((res) => {
        console.log("Now deleting photo with id: " + photoId);
        let newPhotos = photos.filter((photo) => photo !== photoId);
        console.log("newPhotos", newPhotos);
        setPhotos(newPhotos);
        toast.success("Delete photo successfully");
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  const sharePhoto = (e, username) => {
    post("/album/" + albumId + "/" + selectedPhoto + "/share", {
      username,
    })
      .then((res) => {
        setSharedWith(() => {
          return [...sharedWith, username];
        });
        console.log(res);
        toast.success("Share photo successfully");
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };
  const unsharePhoto = (username) => {
    post("/album/" + albumId + "/" + selectedPhoto + "/unshare", {
      username,
    })
      .then((res) => {
        console.log(res);
        setSharedWith(() => {
          return sharedWith.filter((user) => user !== username);
        });
        toast.success("Unshare photo successfully");
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };

  const viewPhoto = (photoId) => {
    navigate(`/album/${albumId}/${photoId}`);
  };

  const getPhotoSharedWith = (photoId) => {
    console.log("PhotoId", photoId);
    get("/album/" + albumId + "/" + photoId + "/detail")
      .then((res) => {
        console.log(res.data.content);
        console.log(res.data.content.sharedWith);
        setSharedWith(res.data.content.sharedWith);
        setOpen(true);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  // if (isLoading)
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
  //       <CircularProgress />
  //     </Box>
  //   );

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom color="#2ecc71">
        Album: {album.name}
      </Typography>

      <div className="row justify-content-center">
        {photos.slice(0, maximum).map((photo) => (
          <div className="mr-5" key={photo}>
            <div className="card mb-4 shadow-lg" onMouseOver={() => setSelectedPhoto(photo)}>
              {selectedPhoto === photo && (
                <div
                  className="card"
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="card-body d-flex justify-content-center align-items-center">
                    <div className="btn bg-transparent" onClick={() => viewPhoto(photo)}>
                      👁
                    </div>
                    <div
                      className="btn bg-transparent"
                      onClick={() => {
                        getPhotoSharedWith(photo);
                      }}
                    >
                      🔗
                    </div>
                    <div className="btn bg-transparent" onClick={() => deletePhoto(photo)}>
                      🗑️
                    </div>
                  </div>
                </div>
              )}
              <img
                src={process.env.REACT_APP_ROOT_API_URL + "/album/" + albumId + "/" + photo}
                alt=""
                className="card-img-top"
                height={200}
                style={{ minWidth: "150px" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <form encType="multipart/form-data" onSubmit={uploadPhoto}>
                <input
                  className="col-md-8"
                  type="file"
                  multiple="multiple"
                  accept="image/*"
                  onChange={uploadMultipleFiles}
                />
                <button className="col-md-4" type="submit">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {progress > 0 && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            backgroundColor: "black",
            width: "100vw",
            height: "100vh",
            opacity: "0.7",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            {progress < 100 ? <CircularProgressWithLabel value={progress} /> : <CircularProgress />}
          </div>
        </div>
      )}
      <ListDialog
        open={open}
        setOpen={setOpen}
        items={sharedWith}
        onSubmitForm={sharePhoto}
        onListItemDelete={unsharePhoto}
      />
      {/* <div ref={dummyElementRef} style={{ width: "10px", height: "10px", backgroundColor: "red" }}></div> */}
      <div ref={dummyElementRef} style={{ padding: "10px" }}></div>

      {/* {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      )} */}
    </>
  );
}
