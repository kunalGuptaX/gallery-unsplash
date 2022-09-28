import React from "react";
import { IImage } from "../types";

type Props = {
  image: IImage;
};

const Image = ({ image }: Props) => {
  return (
    <>
      <div className="w-100 my-3 position-relative">
        <img
          src={image.urls.small}
          className="w-100 h-100"
          alt={image.description || image.alt_description || image.id}
          loading="lazy"
        />
      </div>
    </>
  );
};

export default Image;
