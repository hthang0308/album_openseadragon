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
export default function PhotoShared(props) {
  const [open, setOpen] = useState(false);
  console.count();
  let navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [progress, setProgress] = useState(0);
  const [maximum, setMaximum] = useState(20);
  //get params albumId from url
  //   const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const observer = useRef();
  useEffect(() => {
    get("/share/photo-shared-with-me")
      .then((res) => {
        setPhotos(res.data.content);
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
  const viewPhoto = (photoId) => {
    navigate(`/album/1/${photoId}`);
  };

  // if (isLoading)
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
  //       <CircularProgress />
  //     </Box>
  //   );
  if (photos.length === 0) return <Typography variant="h5">No photos found</Typography>;

  return (
    <>
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
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    {/* <div className="btn bg-transparent">createdAt: {photo.createdAt}</div> */}
                    <Typography color="white" fontSize={12}>
                      {new Date(photo.createdAt).toLocaleString().substring(0, 10)}
                    </Typography>
                    <div className="btn bg-transparent" onClick={() => viewPhoto(photo._id)}>
                      👁
                    </div>
                  </div>
                </div>
              )}
              <img
                src={process.env.REACT_APP_ROOT_API_URL + "/album/1/" + photo._id}
                alt=""
                className="card-img-top"
                height={200}
              />
            </div>
          </div>
        ))}
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
