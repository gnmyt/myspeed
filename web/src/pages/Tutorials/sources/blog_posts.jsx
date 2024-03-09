/**
 * @file This file contains the data for the blog posts section of the Tutorials page
 */

// Creators
import GigazineChannel from "@/pages/Tutorials/sources/channels/gigazine.png";
import MariusHostingChannel from "@/pages/Tutorials/sources/channels/mariushosting.png";

// Thumbnails
import Thumb_20240128 from "@/pages/Tutorials/sources/thumbs/20240128.webp";
import Thumb_MariusMySpeed from "@/pages/Tutorials/sources/thumbs/marius-myspeed.webp";

export default [
    {
        title: "Is my line speed slow or fast? MySpeed review",
        link: "https://gigazine.net/gsc_news/en/20240128-myspeed/",
        thumb: Thumb_20240128,
        creator: GigazineChannel
    },
    {
        title: "How to Install MySpeed on Your Synology NAS",
        link: "https://mariushosting.com/how-to-install-myspeed-on-your-synology-nas/",
        thumb: Thumb_MariusMySpeed,
        creator: MariusHostingChannel
    }
];