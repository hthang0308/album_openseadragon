import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../../utils/ApiCaller";
export default function Album(props) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    get("/share/album-shared-with-me")
      .then((res) => {
        console.log(res.data);
        setAlbums(res.data.content);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  }, []);
  //return multiple cards to show all albums
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  if (albums.length === 0) return <Typography variant="h5">No albums found</Typography>;
  return (
    <div className="container mt-2">
      <div className="row">
        {albums.map((album) => (
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title font-weight-bold">{album.name}</h5>
                <p className="card-text">Total Photos: {album.totalPhotos}</p>
                <p className="card-text">Shared with: {album.sharedWith}</p>
                <a href={`/#/album/${album._id}`} className="btn btn-primary">
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
