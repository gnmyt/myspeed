/**
 * @file This file contains the data for the blog posts section of the Tutorials page
 */

// Creators
import GigazineChannel from "@/pages/Tutorials/sources/channels/gigazine.png";
import MariusHostingChannel from "@/pages/Tutorials/sources/channels/mariushosting.png";
import UbunlogChannel from "@/pages/Tutorials/sources/channels/ubunlog.png";
import BelginuxChannel from "@/pages/Tutorials/sources/channels/belginux.webp";
import LinuxiacChannel from "@/pages/Tutorials/sources/channels/linuxiac.webp";

// Thumbnails
import Thumb_20240128 from "@/pages/Tutorials/sources/thumbs/20240128.webp";
import Thumb_MariusMySpeed from "@/pages/Tutorials/sources/thumbs/marius-myspeed.webp";
import Thumb_UbunlogMySpeed from "@/pages/Tutorials/sources/thumbs/ubunlog-myspeed.webp";
import Thumb_BelginuxMySpeed from "@/pages/Tutorials/sources/thumbs/belginux-myspeed.webp";
import Thumb_LinuxiacMySpeed from "@/pages/Tutorials/sources/thumbs/linuxiac-myspeed.webp";

export default [
    {
        title: "Installer MySpeed avec Docker",
        link: "https://belginux.com/installer-myspeed-avec-docker/",
        thumb: Thumb_BelginuxMySpeed,
        creator: BelginuxChannel
    },
    {
        title: "Keep Track on Your Internet Speed with MySpeed, Here’s How",
        link: "https://linuxiac.com/keep-track-on-your-internet-speed-with-myspeed/",
        thumb: Thumb_LinuxiacMySpeed,
        creator: LinuxiacChannel
    },
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
    },
    {
        title: "What is MySpeed and how is it installed on Debian, Ubuntu and others?",
        link: "https://ubunlog.com/en/myspeed-dev-installation-debian-ubuntu/",
        thumb: Thumb_UbunlogMySpeed,
        creator: UbunlogChannel
    }
];