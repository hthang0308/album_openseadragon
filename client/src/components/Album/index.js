import { useEffect, useRef, useState } from "react";
import { get, post, remove } from "../../utils/ApiCaller";
import { Box, CircularProgress, Grid, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ListDialog from "../ListDialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddNewAlbumDialog from "../AddNewAlbumDialog";
import "./index.css";
import { set } from "lodash";
// import { post } from "../../utils/ApiCaller";
export default function Album(props) {
  const [openNewAlbumDialog, setOpenNewAlbumDialog] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const createNewAlbum = (e, albumName) => {
    e.preventDefault();
    if (albumName === "") {
      toast.error("Album name is required");
      return;
    }

    const data = {
      name: albumName,
    };
    //post
    post("/album", data)
      .then((res) => {
        toast.success(res.data.message);
        setAlbums([...albums, res.data.content]);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  useEffect(() => {
    get("/album")
      .then((res) => {
        setAlbums(res.data.content);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.warn(err.response.data.message);
      });
  }, []);
  const deleteAlbum = (albumId) => {
    remove("/album/" + albumId)
      .then((res) => {
        toast("Album deleted");
        console.log(albums.filter((album) => album.id !== albumId));
        setAlbums(() => [...albums.filter((album) => album._id !== albumId)]);
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  const shareAlbum = (e, username) => {
    e.preventDefault();
    post("/album/" + selectedAlbum._id + "/share", {
      username,
    })
      .then((res) => {
        let tmpSelectAlbum = selectedAlbum;
        tmpSelectAlbum.sharedWith.push(username);
        setSelectedAlbum(() => {
          return {
            ...tmpSelectAlbum,
          };
        });

        console.log(tmpSelectAlbum);
        toast(res.data.message);
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };
  const unshareAlbum = (username) => {
    console.log(username);
    post("/album/" + selectedAlbum._id + "/unshare", {
      username,
    })
      .then((res) => {
        let tmpSelectAlbum = selectedAlbum;
        tmpSelectAlbum.sharedWith = tmpSelectAlbum.sharedWith.filter((user) => user !== username);
        setSelectedAlbum(() => {
          return {
            ...tmpSelectAlbum,
          };
        });
        toast(res.data.message);
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };
  //return multiple cards to show all albums
  return (
    <>
      <div className="container mt-2">
        <div className="row">
          {albums.map((album) => (
            <div className="col-md-3 mb-2">
              <div className="card  shadow-lg">
                <div className="card-body">
                  <Grid style={{ display: "flex", justifyContent: "space-between", overflow: "hidden" }}>
                    <Typography
                      variant="h5"
                      component="h5"
                      className="three-dot"
                      color="#2ecc71"
                      onClick={() => navigate(`/album/${album._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {album.name}
                    </Typography>
                    {/* <Button onClick={() => navigate(`/album/${album._id}`)}>{album.name}</Button>
                    {/* <a className="card-title font-weight-bold text-decoration-none" href={`/#/album/${album._id}`}>
                    {album.name}
                  </a> */}
                    <Grid justifyContent="flex-end">
                      <Button sx={{ m: 0, p: 0, minWidth: "1px", color: "red" }} onClick={() => deleteAlbum(album._id)}>
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>

                  <Typography>Total Photos: {album.totalPhotos}</Typography>
                  <Typography>
                    Share With: &nbsp;
                    <Button
                      sx={{ m: 0, p: 0, minWidth: "25px" }}
                      variant="outlined"
                      onClick={() => {
                        setOpen(true);
                        setSelectedAlbum(album);
                      }}
                    >
                      ...
                    </Button>
                  </Typography>
                </div>
              </div>
            </div>
          ))}
          <div className="col-md-3 mb-2">
            <div className="card mb-3 shadow-lg h-100">
              <div className="card-body">
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Button
                    onClick={() => setOpenNewAlbumDialog(true)}
                    style={{ maxWidth: "100%", maxHeight: "100%", minWidth: "100%", minHeight: "100%" }}
                  >
                    <span className="fa fa-plus"></span>
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ListDialog
          open={open}
          setOpen={setOpen}
          items={selectedAlbum?.sharedWith}
          onSubmitForm={shareAlbum}
          onListItemDelete={unshareAlbum}
        />
      </div>
      <AddNewAlbumDialog open={openNewAlbumDialog} setOpen={setOpenNewAlbumDialog} onSubmitForm={createNewAlbum} />
    </>
  );
}
