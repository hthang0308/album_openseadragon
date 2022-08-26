import { width } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post, remove } from "../../utils/ApiCaller";
import { Box, CircularProgress } from "@material-ui/core";
import { Typography } from "@mui/material";
// import { post } from "../../utils/ApiCaller";
export default function Photo(props) {
  //get params albumId from url
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    get("/share/photo-shared-with-me")
      .then((res) => {
        setPhotos(res.data.content);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  if (photos.length === 0) return <Typography variant="h5">No photos found</Typography>;
  return (
    <>
      <div className="row">
        {photos.map((photo) => (
          <div className="col-md-4">
            <div className="card mb-4">
              <img
                src={process.env.REACT_APP_ROOT_API_URL + "/album/1/" + photo._id}
                alt=""
                className="card-img-top"
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <p className="card-text text-primary font-weight-bold">
                  Created At: {new Date(photo.createdAt).toLocaleString()}
                </p>
                {/* <p className="card-text">{photo.originalname}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
