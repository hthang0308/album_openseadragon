import React, { useState, useEffect } from "react";
import OpenSeadragon from "openseadragon";
import { get } from "../../utils/ApiCaller";
import { useParams } from "react-router-dom";

export default function OpenSeaDragon() {
  const [detail, setDetail] = useState(null);
  const { albumId, photoId } = useParams();
  const [view, setView] = useState();
  const initOpenSeaDragon = () => {
    view && view.destroy();
    setView(
      OpenSeadragon({
        id: "slide",
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        tileSources: {
          Image: {
            xmlns: "https://schemas.microsoft.com/deepzoom/2008",
            Url: `http://localhost:5000/api/album/${albumId}/${photoId}/`,
            Format: "jpeg",
            Overlap: "2",
            TileSize: "512",
            Size: {
              Width: detail.width,
              Height: detail.height,
            },
          },
        },
        smoothTileEdgesMinZoom: 1,
        animationTime: 1,
        opacity: 1,
      })
    );
  };

  useEffect(() => {
    get(`/album/${albumId}/${photoId}/detail`)
      .then((res) => {
        setDetail(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (detail) {
      initOpenSeaDragon();
      return () => {
        view && view.destroy();
      };
    }
  }, [detail]);
  if (detail) {
    return (
      <div>
        <div
          id="slide"
          className="bg-dark mx-auto"
          style={{ width: 1000, height: 1000 * (detail.height / detail.width) }}
        />
      </div>
    );
  }
  return <div>isLoading...</div>;
}
