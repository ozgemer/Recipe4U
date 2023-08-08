import React from "react";
import "./SocialSharing.css";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

export default function SocialSharing() {
  return (
    <div className="social">
      <TwitterShareButton
        className="twitter"
        title={"visit us at:"}
        url={"https://www.facebook.com/Recipe4U-109712465176008"}
        hashtags={["GoodFood", "Tasty", "Yummy"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <FacebookShareButton
        className="facebook"
        url={"https://www.facebook.com/Recipe4U-109712465176008"}
        quote={"good website"}
        hashtag={["#GoodFood"]}
        description={"amazing website, go to watch it"}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
    </div>
  );
}
